var app = new Vue({
  el:'#app',
  data:{
    animate_cards:false,
    gameplay:false,
    is_eliminating:false,
    mode:false,
    answer:false,
    eliminated:new Set(),
    not_checked: true,
    question_list:[],
    current_question:0,
    question_collection:{
      is_odd: arg => [[], "E' un numero dispari?"],
      is_multiple_of: arg => [[arg], `E' multiplo di ${arg}?`],
      contains_digit: arg => [[arg], `Contiene il numero ${arg}?`],
      has_length: arg => [[arg], `Ha una lunghezza di ${arg} cifre?`],
      has_length: arg => [[arg], `Ha una lunghezza di ${arg} cifre o più?`],
      has_sign: arg => [[arg], `Ha segno ${arg.toString().split('')[0]} ?`],
      is_integer: arg => [[], "E' un numero intero?"],
      is_palindrome: arg => [[], "E' un numero palindromo?"],
      is_lesser_than: arg => [[arg], `E' un numero minore di ${arg}?`],
      is_platonic: arg => [[], "E' un numero platonico?"],
      is_perfect: arg => [[], "E' un numero perfetto?"],
      is_power_of: arg => [[arg], `E' una potenza di ${arg}?`],
      is_fibonacci: arg => [[], "E' un numero della serie di Fibonacci?"],
      is_prime: arg => [[], "E' un numero primo?"],
      is_decimal: arg => [[], "E' un numero decimale?"],
      is_binary: arg => [[], "E' un numero binario?"],
      is_made_of_n_digits_equal: arg => [[arg], `E' composto da ${arg} cifre uguali?`]
    },
    questions:{
      easy:[
        'is_multiple_of(3)',
        'is_multiple_of(5)',
        'is_odd',
        'contains_digit(1)',
        'has_length(1)',
        'is_made_of_n_digits_equal(2)'
      ],
      medium:[],
      hard:[]
    },
    numbers:{
      easy:Array.from(Array(30).keys()),
      medium:[1, 'rad2', 0.5, 356, 5, 23, 8, 1010, 1221, 3, 'pi', 'e', 98, 0.1236, 44, -8, 6, 9, 18, 64, 100, 456, 7897, 45, 77, 21, 12, 010, 31, 32],
    },
    star_numbers:{
      pi:{
        value:Math.PI,
        props: new Set(['irrational', 'transcendental'])
      },
      e:{
        value:Math.E,
        props: new Set(['irrational', 'transcendental'])
      },
      rad2:{
        value: Math.SQRT2,
        props: new Set(['irrational', 'algebric'])
      },
      phi:{
        value:(1 + Math.sqrt(5)) / 2,
        props: new Set(['irrational', 'algebric'])
      },
      '1/2':{
        value: 0.5,
        props: new Set(['fraction']),
      }
    },
    current:11,
    current_numbers:[],
    images_root: "assets/images/",
    check_functions: {
        is_odd: function(n){
          return n % 2 != 0
        },
        is_multiple_of: function(n, d){
          console.log(n,d)
          return n % d == 0
        },
        contains_digit: function(n, match){
          return n.toString().match(match) != null
        },
        has_length: function(n, l){
          return n.toString().length == l
        },
        has_length_or_more: function(n, l){
          return n.toString().length >= l
        },
        has_sign: function(n, sign){
          //sign is to be passed as 1 or -1
          return Math.sign(n) == sign
        },
        is_integer: function(n){
          return (n - Math.floor(n)) == 0;
        },
        is_palindrome: function(n){
          if(n.toString().length <= 1){
            return false
          }
          return n.toString().split("").reverse().join("") == n
        },
        is_lesser_than: function(n, m){
          return n < m;
        },
        is_platonic: function(n){
          return new Set([4, 6, 8, 12, 20]).has(n)
        },
        is_perfect: function(n){
          const factors = n => Array
          .from(Array(n + 1), (_, i) => i)
          .filter(i => n % i === 0)
          return factors(n).reduce((a, b) => a + b, 0) == n*2
        },
        is_power_of:function(n, exp){
          return (Math.log(n)/Math.log(exp)) % 1 === 0;
        },
        is_fibonacci: function(n){
          const is_perfectsquare = x => Math.sqrt(x) * Math.sqrt(x) == x
          return is_perfectsquare(5*n*n + 4) || is_perfectsquare(5*n*n - 4)
        },
        is_prime: function(num){
          for(let i = 2, s = Math.sqrt(num); i <= s; i++){
            if(num % i === 0) return false
          }
          return num > 1;
        },
        is_decimal: function(n){
          if (n.fraction){
            return false
          } else {
            return this.check_functions.is_integer(n)
          }
        },
        is_binary:  function (n){
          var nlist = n.toString().split('').map(x => Number(x))
          var n_set = new Set(nlist)
          if(n_set.size > 2){
            return false
          } else if (n_set.has(1) && n_set.has(0)) {
            return true
          } else {
            return false
          }
        },
        is_made_of_n_digits_equal: function(num, n){
          console.log(num, num.length, n);
          if(num.toString().length != n){
            return false
          } else {
            var digits = num.toString().split("")
            console.log(digits);
            return digits.every(d => d == digits[0])
          }
        }
      }
  },
  methods:{
    start: function(mode){
      this.is_eliminating=false,
      this.mode=mode,
      this.answer=false,
      this.eliminated=new Set(),
      this.not_checked= true,
      this.question_list=[],
      this.current_question=0,
      this.gameplay = true;
      this.not_checked = true;
      this.mode = mode;
      this.question_list = this.questions[mode];
      this.current_numbers = JSON.parse(JSON.stringify(this.numbers[this.mode]));
      // this.shuffle_array(this.current_numbers)
      this.current_question = 0
    },
    back: function(){
      this.gameplay = false;
      this.current_numbers = [];
    },
    shuffle_array: function(shuffled) {
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
    },
    check_current: function(){
        this.not_checked = false;
        var type = this.active_questions[this.current_question][0]
        var args = this.active_questions[this.current_question][1]
        var func = this.check_functions[type]
        this.passes_test = func(...[this.current].concat(args))
        if(this.passes_test){
          this.eliminated = new Set(this.current_numbers.filter(el => !func(...[el].concat(args))));
          this.answer = this.passes_test
        } else {
          this.eliminated = new Set(this.current_numbers.filter(el => func(...[el].concat(args))));
          this.answer = this.passes_test
        }
    },
    checks: function(){
      var type = this.active_questions[this.current_question][0]
      var args = this.active_questions[this.current_question][1]
      var func = this.check_functions[type]
      this.is_eliminating = true;
      var root = this;
      window.setTimeout(function () {
        if(root.passes_test){
          root.current_numbers = root.current_numbers.filter(el => func(...[el].concat(args)));
        } else {
          root.current_numbers = root.current_numbers.filter(el => !func(...[el].concat(args)));
        }
        root.not_checked = true;
        root.current_question = root.current_question+1
        root.is_eliminating = false;
      }, 1000);

    },
    get_image: function(n){

      return this.images_root +
      n.toString().replace('.','') +
      '.png'
    },
    delay: function(n){
      if(this.is_eliminating){
        return 0;
      }
      if(this.eliminated.has(n)){
        var max = 150;
        var min = 50;
        var rand = Math.floor(Math.random() * (max - min + 1)) + min
        return rand+'ms'
      } else {
        return 0
      }
    }
  },
  computed:{
    get_grid: function(){
      if(!this.current_numbers) return 'auto';
      var len = this.current_numbers.length;
      const get_cols = cols => Array(cols).fill('auto').join(' ')
      if(len > 16 ){
        return get_cols(10)
      } else if (len > 4){
        return get_cols(8)
      } else if (len > 1){
        return get_cols(4)
      } else {
        return 'auto 460px auto'
      }
    },
    active_questions: function(){
      if(!this.mode){
        return [];
      }
      var questions = [];
      var regExp = /\(([^)]+)\)/;
      for (let k in this.questions[this.mode]){
        var qst = this.questions[this.mode][k]
        var arg;
        try {
          arg = regExp.exec(qst)[1];
        } catch (e) {
          arg = null
        }
        var func = qst.split("(")[0]
        console.log(func, arg);
        questions.push([func].concat(this.question_collection[func](arg)))
      }
      return questions
    },
    current_question_content: function(){
      if(this.current_question < this.active_questions.length){
        return this.active_questions[this.current_question][2]
      } else {
        return 'END!'
      }

    }

  },
  watch:{

  }
})
