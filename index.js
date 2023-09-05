const axios = require("axios");
const inquirer = require("inquirer");

const GITHUB_API_URL = "https://api.github.com/search/repositories";
const GITHUB_API_TOKEN = procss.env.GITHUB_TOKEN; // Replace with your own token

async function fetchMostStarredRepos(startDate, endDate) {
  try {
    const response = await axios.get(GITHUB_API_URL, {
      params: {
        q: `created:${startDate}..${endDate} stars:>1000`, // Filter by date range and stars
        sort: "stars",
        order: "desc",
      },
      headers: {
        Authorization: `token ${GITHUB_API_TOKEN}`,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
    return [];
  }
}

async function getUserInput() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "startDate",
      message: "Enter start date (YYYY-MM-DD):",
    },
    {
      type: "input",
      name: "endDate",
      message: "Enter end date (YYYY-MM-DD):",
    },
  ]);

  return answers;
}

async function displayTopRepositories(repositories) {
  for (let i = 0; i < 10 && i < repositories.length; i++) {
    const repo = repositories[i];
    console.log(`#${i + 1}: ${repo.name} - ${repo.stargazers_count} stars`);
  }
}

async function main() {
  const { startDate, endDate } = await getUserInput();
  const repositories = await fetchMostStarredRepos(startDate, endDate);
  displayTopRepositories(repositories);
}

main(); // Call the main function to start the program
