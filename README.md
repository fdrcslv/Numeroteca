# Numeroteca

Simple static app for the Numeroteca game.

Check it here https://fdrcslv.github.io/Numeroteca/

## 1. Games.json
Games.json is the static file that contains all the information needed by the app to play a round of Numeroteca. 
One game needs:

* the number to be guessed
* the array of questions that the app will ask to the audience (discussed in point 2)

The games are divided by difficulty level:

* easy
* medium
* hard

Every game level has a set of numbers to choose from.

The structure of the json is this:

```
{
  easy:{
    numbers:[2,3,"rad2",1024,"pi"...],
    games:[
      {
        current:11,
        questions:["is_odd","is_miltiple_of(5)"...]
      },
      {
        current:6,
        questions:[...]
      }
      {
        current: 9,
        questions:[...]
      }
    ]
  },
  meedium:{
    numbers:[...],
    games:[

    ]
  },
  hard:{
    numbers:[...],
    games:[...]
  }
}
```

## 2. Questions

### 2.1 Supported Questions
These are the currentlòy suported questions, for integers, decimal, fractions, and "superstar" numbers like Pi etc.
* is_periodic(n)
* is_phisical_constant()
* is_irrational()
* is_algebric()
* is_transcendental()
* is_fraction()
* is_odd()
* is_multiple_of(n)
* contains_digit(n)
* has_length(n)
* has_length_or_more(n)
* has_sign(n) [plus sign passed as 1, minus sign as -1]
* is_integer()
* is_palindrome()
* is_lesser_than(n)
* is_platonic()
* is_perfect()
* is_power_of(n)
* is_fibonacci()
* is_prime()
* is_decimal()
* is_binary()
* is_made_of_n_digits_equal(n)
* is_result_from_expression(n, expression)
* its_modulus_is_lesser_than(n, x)
* is_natural_and_even: function(n)
* is_natural_and_odd(n)
* is_made_of_n_significant_digits(n, d)
* is_even_and_multiple_of(n, m)

And many more!

### 2.2 Question formatting in games.json
To instruct the app to ask a question, just pick a question from the list and write it in the ```questions``` list parameter of the game. If
a question needs am additional parameter (i.e. is_multiple_of) the string will be 

```"is_multiple_of(11)"```


If the question doesn't need a parameter (i.e. is_irrational), just write ```"is_irrational"``` in the list of questions.

### 2.3 Question formatting for the GNuCCI version of the game

Since the different nature of the GNuCCI (Gioco NUmerico Con Carte Indizio) version of the game, every element of questions array holds the answer of the question itself I.E.

```
      {
        current:11,
        questions:[
          "YES:is_odd",
          "NO:is_multiple_of(5)",
          "NO:is_irrational,
           ...
        ]
      },
```

### 2.2.1 Example of questions for the number 11

```
"current":11,
        "questions":[
          "is_multiple_of(3)",
          "is_multiple_of(5)",
          "is_odd",
          "contains_digit(1)",
          "has_length(2)",
          "is_made_of_n_digits_equal(2)"
        ]
```
## 3. Superstar Numbers

The special numbers supported are:

* pi
* e
* phi
* root2
* googol
* c
* GB

Also fractions (like 1/2) need a special treatment since their representation is different from their value. The question "contains_digit(2)" for 1/2 is true for its representation, but not for its value.

## 4. Images
File names for the number cards map simply to the number itself: 1.png for the number 1 and pi.jpg for Pi.

For special carachters and properties we use this table of substitutions:

|Symbol|Substitution|
|:--:|:--:|
|-|minus|
|/|over|
|.|point|
|periodic number|p|

### 4.1 Examples

-1/8 => minus1over8.png

3.25 => 3point25.png

0.33333.. => 0point3p
