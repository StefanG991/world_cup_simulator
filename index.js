import groups from "./data.js";

const playGame = (team1, team2) => {
  let goals1 = 0;
  let goals2 = 0;
  for (let i = 0; i <= 5; i++) {
    if (Math.random() + (team1.rank < team2.rank ? 0.1 : 0) > 0.7) {
      goals1++;
    }
    if (Math.random() + (team2.rank < team1.rank ? 0.1 : 0) > 0.7) {
      goals2++;
    }
  }
  //   condition for elimination stage
  if (team1.eliminationStage) {
    while (goals1 === goals2) {
      if (Math.random() > 0.5) {
        goals1++;
      }
      if (Math.random() > 0.5) {
        goals2++;
      }
    }
  }

  let points1;
  if (goals1 > goals2) points1 = 3;
  else if (goals1 < goals2) points1 = 0;
  else points1 = 1;

  let points2;
  if (goals2 > goals1) points2 = 3;
  else if (goals2 < goals1) points2 = 0;
  else points2 = 1;

  if (goals1 > goals2) {
    team2.loses = team2.loses + 1;
    team1.wins = team1.wins + 1;
  } else if (goals1 < goals2) {
    team1.loses = team1.loses + 1;
    team2.wins = team2.wins + 1;
  } else {
    team1.draws = team1.draws + 1;
    team2.draws = team2.draws + 1;
  }

  team1.points = team1.points + points1;
  team1.goals = team1.goals + goals1;
  team1.received = team1.received + goals2;
  team1.matches = [
    ...team1.matches,
    {
      string: `${team1.name} ${goals1} : ${goals2} ${team2.name}`,
      opponent: team2.name,
      teamGoals: goals1,
      opponentGoals: goals2,
    },
  ];

  team2.points = team2.points + points2;
  team2.goals = team2.goals + goals2;
  team2.received = team2.received + goals2;
  team2.matches = [
    ...team2.matches,
    {
      string: `${team1.name} ${goals1} : ${goals2} ${team2.name}`,
      opponent: team1.name,
      opponentGoals: goals1,
      teamGoals: goals2,
    },
  ];
};

const groupStageMatches = (groups) => {
  for (let i = 0; i < 3; i++) {
    if (i === 0) {
      let outputString = "Group stage 1st round : \n";
      groups.forEach((group) => {
        outputString += `Group ${group.name}` + "\n";
        playGame(group.teams[0], group.teams[1]);
        playGame(group.teams[2], group.teams[3]);
        outputString +=
          `${group.teams[0].matches[0].string}` +
          "\n" +
          `${group.teams[2].matches[0].string}` +
          "\n\n";
      });
      console.log(outputString);
    }
    if (i === 1) {
      let outputString = "Group stage 2nd round : \n";
      groups.forEach((group) => {
        outputString += `Group ${group.name}` + "\n";
        playGame(group.teams[0], group.teams[2]);
        playGame(group.teams[1], group.teams[3]);
        outputString +=
          `${group.teams[0].matches[1].string}` +
          "\n" +
          `${group.teams[1].matches[1].string}` +
          "\n\n";
      });
      console.log(outputString);
    }
    if (i === 2) {
      let outputString = "Group stage 3rd round : \n";
      groups.forEach((group) => {
        outputString += `Group ${group.name}` + "\n";
        playGame(group.teams[0], group.teams[3]);
        playGame(group.teams[1], group.teams[2]);
        outputString +=
          `${group.teams[0].matches[2].string}` +
          "\n" +
          `${group.teams[1].matches[2].string}` +
          "\n\n";
      });
      console.log(outputString);
    }
  }
};

const advanceGenerator = (groups) => {
  for (let group of groups) {
    group.teams.sort((team1, team2) => {
      let match = team1.matches.find((match) => match.opponent === team2.name);
      let team1Goals = match.team1Goals;
      let team2Goals = match.opponentGoals;
      let goalDiff1 = team1.goals - team1.received;
      let goalDiff2 = team2.goals - team2.received;
      if (team2.points > team1.points) return 1;
      else if (team2.points < team1.points) return -1;
      else if (goalDiff2 > goalDiff1) return 1;
      else if (goalDiff2 < goalDiff1) return -1;
      else if (team2.goals > team1.goals) return 1;
      else if (team2.goals < team1.goals) return -1;
      else if (team2Goals > team1Goals) return 1;
      else if (team2Goals < team1Goals) return -1;
      else return Math.random() > 0.5 ? 1 : -1;
    });
    let outputString =
      `Group : ${group.name}${new Array(24).join(
        " "
      )}Win Draw Loss Goals Points` + "\n";
    group.teams.forEach((team, i) => {
      let goalDiff = `${team.goals}:${team.received}`;
      let goalDiff1 = goalDiff + new Array(6 - goalDiff.length).join(" ");
      let country = `${team.name}(${team.rank})`;
      let country1 = country + new Array(30 - country.length).join(" ");
      outputString +=
        `${i + 1}. ${country1} ${team.wins}    ${team.draws}    ${
          team.loses
        }  ${goalDiff1}    ${team.points}` + "\n";
    });
    console.log(outputString);
  }
};

groupStageMatches(groups);
advanceGenerator(groups);

let eliminationStage = [];
for (let group of groups) {
  eliminationStage = [
    ...eliminationStage,
    {
      ...group.teams[0],
      group: group.name,
      eliminationStage: true,
      round: 1,
      place: 1,
    },
    {
      ...group.teams[1],
      group: group.name,
      eliminationStage: true,
      round: 1,
      place: 2,
    },
  ];
}

const createPairs = (array) => {
  let generatedPairs = [];
  let arr1;
  let arr2;
  if (array[0].round === 1) {
    arr1 = array.filter((team) => team.place === 1);
    arr2 = array.filter((team) => team.place === 2);
    arr1.sort(() => 0.5 - Math.random());
    arr2.sort(() => 0.5 - Math.random());
    while (arr1.length) {
      let pair = [];
      let team1 = arr1.pop();
      let sameGroup = team1.group === arr2[0].group;
      let team2 = sameGroup ? arr2.pop() : arr2.shift();
      pair.push(team1);
      pair.push(team2);
      generatedPairs.push(pair);
    }
  } else {
    arr1 = array.slice();
    arr2 = array.slice();
    arr1.sort(() => 0.5 - Math.random());
    arr2.sort(() => 0.5 - Math.random());
    while (arr1.length) {
      let pair = [];
      let team1 = arr1.pop();
      let index = arr2.findIndex((team) => team1.name === team.name);
      arr2.splice(index, 1);
      let team2 = arr2.pop();
      let index1 = arr1.findIndex((team) => team2.name === team.name);
      arr1.splice(index1, 1);
      pair.push(team1);
      pair.push(team2);
      generatedPairs.push(pair);
    }
  }
  return generatedPairs;
};

let randomPairs = createPairs(eliminationStage);

for (let i = 0; i < 4; i++) {
  let outputString;
  let flag = false;
  if (i === 0) {
    outputString = "Elimination stage Round of 16 : \n";
    randomPairs.forEach((pair) => {
      pair[0].round = 0;
      pair[1].round = 0;
    });
  } else if (i === 1) outputString = "Elimination stage Quarter Finals : \n";
  else if (i === 2) outputString = "Elimination stage Semi-Finals : \n";
  else {
    flag = true;
    outputString = "Elimination stage Finals : \n";
  }

  randomPairs.forEach((pair) => {
    playGame(pair[0], pair[1]);
    outputString +=
      `(${pair[0].group}${pair[0].place})${pair[0].name} ${
        pair[0].matches[pair[0].matches.length - 1].teamGoals
      } : ${pair[0].matches[pair[0].matches.length - 1].opponentGoals} (${
        pair[1].group
      }${pair[1].place})${pair[1].name}  ` + "\n";
    if (
      pair[0].matches[pair[0].matches.length - 1].teamGoals >
      pair[0].matches[pair[0].matches.length - 1].opponentGoals
    ) {
      pair.pop();
    } else {
      pair.shift();
    }
  });
  console.log(outputString);
  let newArr2 = randomPairs.map((element) => {
    return element[0];
  });

  flag
    ? console.log(`Winner : ${randomPairs[0][0].name}`)
    : (randomPairs = createPairs(newArr2));
}
