# Numeroteca

Simple static app for the Numeroteca game.

## Games.json
Games.json is the static file that contains all the information needed by the app to play a round of Numeroteca. 
One game needs:

* the number to be guessed
* the array of questions that the app will ask to the audience

The games are divided by difficulty level:

* easy
* medium
* hard

Every game level has a set of numbers to choose from.

The structure of the json is this:

‘’’
{
    easy:{
        numbers:[2,3,’rad2’,1024,’pi’...],
        games:[
            {
                current:11,
                questions:[‘is_odd’,’is_miltiple_of(5)...],
            },{
                current:6,
                questions:[],
            }
    }

‘’’
