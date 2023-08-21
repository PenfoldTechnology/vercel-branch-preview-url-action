// Approach based on Vercel docs and a lot of trial and error.
// See: https://vercel.com/docs/concepts/deployments/generated-urls#truncation

const {createHash} = require("crypto");
const core = require('@actions/core');

/**
 * Generate the branch preview URL for a Vercel deployment.
 * @param [teamId] {string}
 * @param [projectName] {string}
 * @param [branchName] {string}
 */
function generateBranchPreviewURL(teamId, projectName, branchName) {
    teamId = teamId || core.getInput("vercel-team-id")
    projectName = projectName || core.getInput("vercel-project-name")
    branchName = branchName || core.getInput("git-branch-name")

    console.log()
    console.log(">>> log inputs...")
    console.log("vercel-project-name: %s", projectName)
    console.log("vercel-team-id: %s", projectName)
    console.log("git-branch-name: %s", branchName)

    console.log();
    console.log(">>> building url...");

    const safeBranchName = branchName
        .replace(/\//, "-") // replace first "/" with "-"
        .replace(/\//g, "") // remove all other "/"
        .replace(/[^a-z0-9]/gi, "-"); // replace any other non-alphanumeric char with "-"
    const url = `${projectName}-git-${safeBranchName}-${teamId}.vercel.app`;
    const requiresTruncation = url.replace(".vercel.app", "").length > 63;

    console.log("- project: %s", projectName);
    console.log("- team: %s", teamId);
    console.log("- branch: %s", branchName);
    console.log("- safe branch: %s", safeBranchName);
    console.log("- url: %s", url);
    console.log("- length: %s", url.length);
    console.log("- will truncate: %s", requiresTruncation ? "yes" : "no");

    if (!requiresTruncation) {
        core.setOutput("url", "https://" + url);
        return
    }

    console.log();
    console.log(">>> truncating url...");

    const input = "git-" + branchName + projectName;
    const sha = createHash("sha256").update(input).digest("hex");
    const shaSlice = sha.slice(0, 6);
    const prefix = `${projectName}-git-${safeBranchName}`
        .slice(0, 44)
        .replace(/-$/, ""); // remove trailing "-"
    const truncatedUrl = `${prefix}-${shaSlice}-${teamId}.vercel.app`;

    console.log("- sha input: %s", input);
    console.log("- sha: %s", sha);
    console.log("- truncated url: %s", truncatedUrl);
    console.log("- length: %s", truncatedUrl.length);

    core.setOutput("url", "https://" + truncatedUrl);
}

// eg. `node ./github/scripts/generate_branch_preview_url.js $team $project $branch`
if (process.argv.length === 5) {
    generateBranchPreviewURL(process.argv[2], process.argv[3], process.argv[4]);
} else {
    generateBranchPreviewURL()
}
