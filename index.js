
var app = new Vue({
  el:'#app',
  data:{
    games:{},
    game:{
      mode:false,
      picked: false
    },
    images_root: "assets/images/",
    chosing_deck:{
      card_picked:'',
      picked:false,
      closed:true
    },
    question_deck:{
      visible: false,
      card_picked: null,
      picked:false,
      container_class:'question-picker-open',
    },
    game_deck:{
      is_eliminating:false,
      checked: false,
      tada:true
    },
    phases:{
      welcome:true,
      chosing_for_you:false,
      gameplay: false,
    },
    info:{
      number_info:false,
      is_hiding_info:false,
      info_selection:false,
    },
    passes_test:false,
    eliminated:new Set(),
    fake_eliminated: new Set(),
    current_numbers:[],
    current_question:0,
    print_list: function(a, d, f, l){
      return `${a.join(d).substring(0,a.join(d).lastIndexOf(f)) +
      ' e' +
      a.join(d).substring([a.join(d).lastIndexOf(l)])}`
    },
    question_collection:{
      is_natural: arg => [[], "È un numero naturale?"],
      is_real : arg => [[], "È un numero reale?"],
      is_periodic: arg => [[], "È un numero periodico?"],
      is_phisical_constant: arg => [[], "È una costante fisica?"],
      is_irrational: arg => [[], "È un numero irrazionale?"],
      is_algebric: arg => [[], "È un numero algebrico?"],
      is_transcendental: arg => [[], "È un numero trascendente?"],
      is_fraction  : arg => [[], "È una frazione?"],
      is_odd: arg => [[], "È un numero dispari?"],
      is_multiple_of: arg => [[arg], `È multiplo di ${arg}?`],
      contains_digit: arg => [[arg], `Contiene il numero ${arg}?`],
      contains_multiple_digits: arg => [arg, `Contiene le cifre ${this.app.print_list(arg, ', ', ',', ' ')}?`],
      has_length: arg => [[arg], `Ha una lunghezza di ${arg} cifr${arg==1 ? 'a':'e'}?`],
      has_length_or_more: arg => [[arg], `Ha una lunghezza di ${arg} cifr${arg==1 ? 'a':'e'} o più?`],
      has_sign: arg => [[arg], `Ha segno ${arg.toString().split('')[0]} ?`],
      is_integer: arg => [[], "È un numero intero?"],
      is_palindrome: arg => [[], "È un numero palindromo?"],
      is_lesser_than: arg => [[arg], `È un numero minore di ${arg}?`],
      is_platonic: arg => [[], "È un numero corrispondente alle facce dei solidi platonici?"],
      is_perfect: arg => [[], "È un numero perfetto?"],
      is_power_of: arg => [[arg], `È una potenza di ${arg}?`],
      is_fibonacci: arg => [[], "È un numero della serie di Fibonacci?"],
      is_prime: arg => [[], "È un numero primo?"],
      is_decimal: arg => [[], "È un numero decimale?"],
      is_binary: arg => [[], "È un numero binario?"],
      is_made_of_n_digits_equal: arg => [[arg], `È composto da ${arg} cifre uguali?`],
      is_result_from_expression: arg => [[arg], `È il risultato della seguente espressione ${arg} ? `],
      its_modulus_is_lesser_than: arg =>[[arg] `Il suo modulo è minore di ${arg}`],
      is_natural_and_even: arg =>[[], "È un numero naturale dispari?"],
      is_natural_and_odd: arg =>[[],  "È un numero naturale pari?"],
      is_made_of_n_significant_digits: arg => [[arg], `È composto da ${arg} cifr${arg==1 ? 'a':'e'} significativ${arg==1 ? 'a':'e'}?`],
      is_even_and_multiple_of: arg => [[arg], `È un numero pari multiplo di ${arg}?`],
      is_bigger_then: arg => [[arg], `È maggiore di ${arg}`],
      is_current_year: arg => [[], `È l'anno in cui ci troviamo?`],
      is_bigger_then_teacher: arg => [[], 'È un numero più grande dell’età della vostra insegnante?'],
      is_french_card_deck: arg => [[], 'È il numero di carte di un seme in un mazzo di carte completo?'],
      has_digits_equal: arg => [[], 'Contiene almeno due cifre uguali tra di loro?']
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
      c:{
        value: 299792458,
        props: new Set(['phisical'])
      },
      gb:{
        value: 1073741824,
        props: new Set([])
      },
      googol:{
        value: 100000000000000000000,
        props: new Set([])
      },
      '2pow42':{
        value: 4398046511104,
        props: new Set([])
      },
      '1/2':{
        value: 0.5,
        props: new Set(['fraction']),
        repr:true,
      },
      '-1/2':{
        value:-0.5,
        props: new Set(['fraction'])
      },
      '-0.3p':{
        value:-1/3,
        props: new Set(['fraction', 'periodic'])
      },
      '2/3':{
        value:2/3,
        props: new Set(['fraction', 'periodic'])
      },
      '1/3':{
        value:1/3,
        props: new Set(['fraction', 'periodic'])
      },
    },
    need_repr: new Set(['contains_digit',]),
    needs_key: new Set(['is_irrational', 'is_algebric', 'is_transcendental', 'is_fraction', 'is_phisical_constant']),
    check_functions: {
        is_natural: function(n){
          return this.app.check_functions.has_sign(n, 1) || n == 0
        },
        is_real: function(){
          //crazy
          return true
        },
        has_special_prop: function(n, app, prop){
          if(app.star_numbers[n]){
            return app.star_numbers[n].props.has(prop)
          } else {
            return false
          }
        },
        //verbose, but helps with labels for the questions, and for the games.json standard
        is_periodic: function(n){
          return this.app.check_functions.has_special_prop(n, this.app, 'periodic')
        },
        is_phisical_constant: function (n){
          return this.app.check_functions.has_special_prop(n, this.app, 'phisical')
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
        contains_multiple_digits: function(n, ...matches){
          const is_contained = (current) => n.toString().match(current) != null
          return matches.every(is_contained)
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
        is_prime: function(n){
          for(let i = 2, s = Math.sqrt(n); i <= s; i++){
            if(n % i === 0) return false
          }
          return n > 1;
        },
        is_decimal: function(n){
          if (n.fraction){
            return false
          } else {
            return this.app.check_functions.is_integer(n)
          }
        },
        is_binary:  function (n){
          var nlist = n.toString().split('').map(x => Number(x))
          var n_set = new Set(nlist)
          if(n_set.size > 2){
            return false
          } else if (n_set.has(1) || n_set.has(0)) {
            return true
          } else {
            return false
          }
        },
        is_made_of_n_digits_equal: function(n, x){
          if(n.toString().length != x){
            return false
          } else {
            var digits = n.toString().split("")
            return digits.every(d => d == digits[0])
          }
        },
        is_result_from_expression: function(n, expression){
          //eval is evil I know
          try {
            var res = (n == eval(expression));
          } catch (e) {
            console.error('the expression is invalid')
            res = false;
          } finally {
            return res;
          }
        },
        its_modulus_is_lesser_than: function(n, x){
          return this.app.check_functions.is_lesser_than(Math.abs(n), x)
        },
        is_natural_and_even: function(n){
          var chf = this.app.check_functions;
          return chf.is_natural(n) && chf.is_multiple_of(n, 2)
        },
        is_natural_and_odd: function(n){
          var chf = this.app.check_functions;
          return chf.is_natural(n) && chf.is_odd()
        },
        is_made_of_n_significant_digits: function(n, d){
          return n.toString().split('.')[0].length == d
        },
        is_even_and_multiple_of: function(n, m){
          var chf = this.app.check_functions;
          return chf.is_multiple_of(n, m) && chf.is_multiple_of(n, 2)
        },
        is_bigger_then: function(n, m){
          return n > m
        },
        is_current_year: function(n){
          return new Date().getFullYear() == n
        },
        is_bigger_then_teacher: function(n){
          return n > 25
        },
        is_french_card_deck: function(n){
          return n == 13;
        },
        has_digits_equal: function(n){
          var test = n.toString().split("");
           return test.some(function(v,i,list){
             return list.lastIndexOf(v)!=i;
           });
        }
      }
  },
  created(){
    var root = this;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        root.games = JSON.parse(this.responseText)
       }
     };

   xhttp.open("GET", "assets/games.json", true);
   xhttp.send()
  },
  methods:{
    _display_qst:function(){
      var root = this;
      window.setTimeout(function(){
        root.question_deck.picked = true;
        root.question_deck.container_class =  'question-picker-down';
      },1000)
    },
    toggle_phase: function(phase){
      Object.keys(this.phases).forEach(v => this.phases[v] = false);
      this.phases[phase] = true;
    },
    get_z_index:function(){
      return Math.floor(Math.random()*10);
    },
    get_translation: function(i, j){
      if (!this.chosing_deck.closed && this.chosing_deck.picked){
        return {
          'transform':'translate(0,0)',
          'transition-delay':'1s',
          'transition': 'all ease 0.5s',
        }
      } else if (!this.chosing_deck.closed && !this.chosing_deck.picked){
        return {
          'transform':'translate(0,0)',
          'transition': 'all ease 0.5s',
        }
      } else {
        return {
          'transform':`translate(${-100*(i-1)+450}%,${-j*100+100+i}%) scale(3)`,
          'transition-delay':'1s',
          'transition': 'all ease 0.5s',
        }
      }
    },
    pick: function(i,j){
      if(!this.chosing_deck.closed){
        this.chosing_deck.picked = false;
      } else {
        this.chosing_deck.picked = true;
        // this.game.picked  = Math.floor(Math.random() * this.games[this.game.mode].games.length);
        // this.game.picked = 2;
        this.chosing_deck.card_picked = `${i}${j}`
      }
    },
    start: function(mode){
      this.toggle_phase('chosing_for_you')
      this.game_deck.is_eliminating=false;
      this.game.mode = mode;
      this.game_deck.tada= true;
      this.passes_test=false;
      this.eliminated=new Set();
      this.fake_eliminated=new Set();
      this.game_deck.checked= false;
      this.current_numbers = JSON.parse(JSON.stringify(this.games[this.game.mode].numbers));
      // this.shuffle_array(this.current_numbers)
      this.current_question = 0
    },
    back: function(){
      this.phases.gameplay = false;
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
    toggle_fake_eliminated: function(n){
      if(this.fake_eliminated.has(n)){
        this.fake_eliminated.delete(n)
      } else {
        this.fake_eliminated.add(n)
      }
      this.$forceUpdate()
    },
    check_current: function(){
        this.game_deck.checked = true;
        this.question_deck.card_picked = -1;
        var type = this.active_questions[this.current_question][0]
        var args = this.active_questions[this.current_question][1]
        var func = this.check_functions[type]
        var root = this;
        function filter_function(el, args){
          var temp_el = el;
          if(root.star_numbers[el]){
            if(root.need_repr.has(type)){
              temp_el = (root.star_numbers[el].repr ? el :  root.star_numbers[el].value)
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
        } else {
          this.eliminated = new Set(this.current_numbers.filter(el => filter_function(el, args)));
        }
    },
    checks: function(){
      var type = this.active_questions[this.current_question][0]
      var args = this.active_questions[this.current_question][1]
      var func = this.check_functions[type]
      this.game_deck.is_eliminating = true;
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
      this.fake_eliminated = new Set()
      window.setTimeout(function () {
        if(root.passes_test){
          root.current_numbers = root.current_numbers.filter(el => filter_function(el, args));
        } else {
          root.current_numbers = root.current_numbers.filter(el => !filter_function(el, args));
        }
        root.game_deck.checked = false;
        root.current_question = root.current_question+1
        console.log(root.current_question >= root.questions.length);
        if(root.current_question >= root.questions.length){
          root.question_deck.visible = true;
          root.question_deck.picked = true;
          root.question_deck.container_class = 'question-picker-down'
        } else {
          root.question_deck.visible = false;
          root.question_deck.picked = false;
          root.question_deck.container_class = 'question-picker-open';
        }
        root.game_deck.is_eliminating = false;
      }, 1000);

    },
    get_image: function(n){
      return this.images_root +
      `${this.game.mode}/` +
      n.toString()
        .replace('.','')
        .replace('/', 'over') +
      '.png'
    },
    delay: function(n){
      if(this.game_deck.is_eliminating){
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
    },
    get_info: function(n){
      if(n){
        this.info.info_selection = n;
        this.info.number_info = !this.info.number_info;
      } else {
        this.info.is_hiding_info = true
        var root = this
        window.setTimeout(function(){
          root.info.number_info = false;
          root.info.is_hiding_info = false;
        }, 500)
      }
    }
  },
  computed:{
    questions: function(){
      return this.games[this.game.mode].games[this.game.picked].questions;
    },
    current: function(){
      return this.games[this.game.mode].games[this.game.picked].current;
    },
    games_loaded: function(){
      return !!this.games;
    },
    get_qst_grid:function(){
      const get_cols = cols => Array(cols).fill('auto').join(' ')
      return get_cols(this.active_questions.length)
    },
    qst_height:function(){
      return this.question_deck.picked ? '0 !important' : 'auto !important'
    },
    get_grid: function(){
      if(!this.current_numbers) return 'auto';
      var len = this.current_numbers.length;
      const get_cols = cols => Array(cols).fill('auto').join(' ')
      if(len > 16 ){
        return get_cols(10)
      } else if (len > 7){
        return get_cols(8)
      } else if (len > 4){
        return get_cols(6)
      } else if (len > 1){
        return get_cols(4)
      } else {
        return 'auto 460px auto'
      }
    },
    active_questions: function(){
      if(!this.game.mode){
        return [];
      }
      var questions = [];
      var regExp = /\(([^)]+)\)/;
      var safe_expression = /([^0-9*/+().<>=-])/;
      for (let k in this.questions){
        var qst = this.questions[k];
        var func = qst.split("(")[0];
        var arg;

        if(func == 'is_result_from_expression'){
          arg = qst.slice(qst.indexOf('(')+1, qst.lastIndexOf(')'))
          if(! safe_expression.exec(arg)){
              console.error('The expression can only contain numbers and mathematical operators */+().<>=-')
          }
        } else {
          try {
            arg = regExp.exec(qst)[1];
            if(arg.includes(',')){

              arg = arg.split(',')
            }
          } catch (e) {
            arg = null
          }
        }
        questions.push([func,].concat(this.question_collection[func](arg)))
      }
      return questions
    },
    current_question_content: function(){
      if(this.current_question < this.active_questions.length){
        return this.active_questions[this.current_question][2]
      } else {
        var root = this;
        window.setTimeout(function(){
          root.game_deck.tada = false
        }, 1000)

        return `Complimenti! Il numero misterioso è ${this.current}`
      }

    }

  },
  watch:{

  }
})
