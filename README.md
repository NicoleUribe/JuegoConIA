# Welcome to Cuatela whit IA

### Team

- Franklin Ruben Rosembluth Prado
- Luis Sebastian Salazar Villegas
- Nicole Alejandra Uribe Tapia

# Installation Guide.md

Hello, and welcome to this guide.
To intall this proyect in you device, you need to follow the next steps:

- Create a new empty folder and open cmd whit the direction of the folder
- Copy the link of the proyect and out this command:
    ######git clone https://github.com/NicoleUribe/JuegoConIA.git
- Open the folder in VScode or whit JupyterNotebook
- Inside of the folder you will find many files
- Open the file "RewriteBoard.ipynb"
- Run all cells
- Go to the final of the page
- Start to play by giving your disk name (Example: BLACK or WHITE)

## Experiments
## How our heuristics works
- The first heuristic consists of assigning a value to each state, depending on the number of rows and columns that have single player tiles, the closeness to a 2x2 square and the number of corners that are occupied by a player, the idea is that if one player has more rows, columns, squares and corners than the other, then their current state is better than the other player, maximizing if is max player or minimizing if is min player.
- The second heuristic seeks to gather all the position of the same same value nearby if is min or max, makes the position that are further away come closer, selects a position and adds its cost with the costs of the positions that are around it, then compares this cost with the costs of the others and the one that is higher and lower returns it to move that position closer to the others.

First heuristics determines gets a values that represents in algorithm which position in an array of possible actions is more convenient to choose.
![image](https://user-images.githubusercontent.com/88517815/229406640-19ba3232-5e28-437a-943c-943235bac394.png)

## Depth Paramaters
We experimented with many depth to cut off, this is the graphic based on cuts in game tree.
![image](https://user-images.githubusercontent.com/88517815/229404873-348c6de3-7042-4974-87d1-611287431869.png)
After analyzing the time, we have found that the ideal depth range is between 3 and 5. The reason for this is that it takes less than 5 seconds to obtain a result, and having a depth of at least 3 ensures that the time required is less than 2 seconds. On the other hand, any depth greater than 5 would result in a time greater than 10 seconds. In terms of the best options, a depth of 1 is the lowest, followed by 3 and then 4.
Based on these findings, it can be inferred that a lower depth is preferable since there is a direct correlation between depth and time due to the expansion of states.

Comparing whether it starts with min or starts with max, there is a slight tendency to believe that when it starts with max, state expansion tends to take longer than when it starts with min.

## Comparing min_max_cutoff and Comparing min_max_cutoff with alpha-beta pruning
We determined that min_max_cutoff with alpha-beta pruning expands all possible states until max_depth is reached, and this has variations when using different heuristics according with the cut or the action used.
Getting all the possible actions for a state increases the time, this is why even though not so many states are expanded, time is really high.

###End
