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
    question_collection:[
      ['is_multiple_of', [5], "E' multiplo di 5?"],
      ['is_multiple_of', [2], "E' multiplo di 2"],
      ['is_binary', [], "E' binario?"],
      ['contains_digit', [9], 'Contiene il numero 9?'],
      ['is_palindrome', [], "E' palindromo?"],
      ['has_sign', [-1], "E' negativo?"]
    ],
    questions:{
      easy:[4, 1, 2, 3, 5,],
      medium:[],
      hard:[]
    },
    numbers:[1, 'rad2', 0.5, 356, 5, 23, 8, 1010, 1221, 3, 'pi', 'e', 98, 0.1236, 44, -8, 6, 9, 18, 64, 100, 456, 7897, 45, 77, 21, 12, 010, 31, 32],
    current:-8,
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
      this.current_numbers = JSON.parse(JSON.stringify(this.numbers));
      this.shuffle_array(this.current_numbers)
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
      if(this.current_numbers.length > 22){
        return Array(10).fill('auto').join(' ')
      } else if(this.current_numbers.length > 10){
        return Array(7).fill('auto').join(' ')
      } else if (this.current_numbers.length > 9){
        return Array(5).fill('auto').join(' ')
      }
    },
    active_questions: function(){
      if(!this.mode){
        return [];
      }
      qst = []
      for (let i in this.questions[this.mode]){
        qst.push(this.question_collection[this.questions[this.mode][i]])
      }
      return qst
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
