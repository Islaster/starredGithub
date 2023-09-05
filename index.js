const axios = require("axios");
const inquirer = require("inquirer");
require("dotenv").config();

const GITHUB_API_URL = "https://api.github.com/search/repositories";
const GITHUB_API_TOKEN = process.env.GITHUB_TOKEN;

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

    const { items } = response.data;

    // Display information about the top 10 most starred repositories
    for (let i = 0; i < 10 && i < items.length; i++) {
      const repo = items[i];
      console.log(`#${i + 1}: ${repo.name} - ${repo.stargazers_count} stars`);
    }
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
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

  const { startDate, endDate } = answers;
  return { startDate, endDate };
}

async function main() {
  const { startDate, endDate } = await getUserInput();
  await fetchMostStarredRepos(startDate, endDate);
}

main(); // Call the main function to start the program
