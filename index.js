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
    questions:[],
    question_collection:{
      is_irrational: arg => [[arg], "E' un numero irrazionale?"],
      is_algebric: arg => [[arg], "E' un numero algebrico?"],
      is_transcendental: arg => [[arg], "E' un numero trascendente?"],
      is_fraction  : arg => [[arg], "E' una frazione?"],
      is_odd: arg => [[], "E' un numero dispari?"],
      is_multiple_of: arg => [[arg], `E' multiplo di ${arg}?`],
      contains_digit: arg => [[arg], `Contiene il numero ${arg}?`],
      has_length: arg => [[arg], `Ha una lunghezza di ${arg} cifre?`],
      has_length_or_more: arg => [[arg], `Ha una lunghezza di ${arg} cifre o più?`],
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
    games:{},
    games_loaded:false,
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
        repr:true,
      }
    },
    tada:true,
    current:false,
    current_numbers:[],
    images_root: "assets/images/",
    need_repr: new Set(['contains_digit',]),
    needs_key: new Set(['is_irrational', 'is_algebric', 'is_transcendental', 'is_fraction']),
    check_functions: {
        has_special_prop: function(n, app, prop){
          if(app.star_numbers[n]){
            return app.star_numbers[n].props.has(prop)
          } else {
            return false
          }
        },
        is_irrational: function(n){
          return this.app.check_functions.has_special_prop(n, this.app, 'irrational')
        },
        is_algebric: function(n){
          return this.app.check_functions.has_special_prop(n, this.app, 'algebric')
        },
        is_transcendental: function(n){
          return this.app.check_functions.has_special_prop(n, this.app, 'transcendental')
        },
        is_fraction: function(n){
          return this.app.check_functions.has_special_prop(n, this.app, 'fraction')
        },
        is_odd: function(n){
          console.log(n);
          console.log((n - Math.floor(n)) == 0);
          if((n - Math.floor(n)) == 0){
            return n % 2 != 0
          } else {
            return false
          }
        },
        is_multiple_of: function(n, d){
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
          if(num.toString().length != n){
            return false
          } else {
            var digits = num.toString().split("")
            return digits.every(d => d == digits[0])
          }
        }
      }
  },
  created(){
    var root = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        root.games = JSON.parse(this.responseText)
        root.games_loaded = true;
       }
     };

   xhttp.open("GET", "assets/games.json", true);
   xhttp.send()
  },
  methods:{
    start: function(mode){
      this.is_eliminating=false;
      this.mode=mode;
      this.tada= true;
      this.answer=false;
      this.eliminated=new Set();
      this.not_checked= true;
      this.current_question=0;
      this.gameplay = true;
      this.not_checked = true;
      var pick  = Math.floor(Math.random() * this.games[this.mode].games.length)
      this.questions = this.games[this.mode].games[pick].questions;
      this.current_numbers = JSON.parse(JSON.stringify(this.games[this.mode].numbers));
      this.current = this.games[this.mode].games[pick].current;
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
        var root = this;
        function filter_function(el, args){
          var temp_el = el;
          console.log(el);
          if(root.star_numbers[el]){
            if(root.need_repr.has(type)){
              console.log(type, el);
              temp_el = (root.star_numbers[el].repr ? el :  root.star_numbers[el].value)
              console.log(temp_el);
            } else if(root.needs_key.has(type)){
              temp_el = el
            } else {
              temp_el = root.star_numbers[el].value
            }
          }
          return func(...[temp_el].concat(args))
        }

        this.passes_test = filter_function(this.current, args)

        if(this.passes_test){
          this.eliminated = new Set(this.current_numbers.filter(el => !filter_function(el, args)));
          this.answer = this.passes_test
        } else {
          this.eliminated = new Set(this.current_numbers.filter(el => filter_function(el, args)));
          this.answer = this.passes_test;
        }
    },
    checks: function(){
      var type = this.active_questions[this.current_question][0]
      var args = this.active_questions[this.current_question][1]
      var func = this.check_functions[type]
      this.is_eliminating = true;
      var root = this;
      function filter_function(el, args){
        var temp_el = el;
        if(root.star_numbers[el]){
          if(root.need_repr.has(type)){
            temp_el = (root.star_numbers[el].repr ? el :  root.star_numbers[el].value)
          } else {
            temp_el = root.star_numbers[el].value
          }
        }
        return func(...[temp_el].concat(args))
      }

      window.setTimeout(function () {
        if(root.passes_test){
          root.current_numbers = root.current_numbers.filter(el => filter_function(el, args));
        } else {
          root.current_numbers = root.current_numbers.filter(el => !filter_function(el, args));
        }
        root.not_checked = true;
        root.current_question = root.current_question+1
        root.is_eliminating = false;
      }, 1000);

    },
    get_image: function(n){
      return this.images_root +
      `${this.mode}/` +
      n.toString().replace('.','').replace('/', 'su') +
      '.jpg'
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
      for (let k in this.questions){
        var qst = this.questions[k]
        var arg;
        try {
          arg = regExp.exec(qst)[1];
        } catch (e) {
          arg = null
        }
        var func = qst.split("(")[0]
        questions.push([func].concat(this.question_collection[func](arg)))
      }
      return questions
    },
    current_question_content: function(){
      if(this.current_question < this.active_questions.length){
        return this.active_questions[this.current_question][2]
      } else {
        var root = this;
        window.setTimeout(function(){
          root.tada = false
        }, 1000)

        return `Complimenti! Il numero misterioso è ${this.current}`
      }

    }

  },
  watch:{

  }
})
