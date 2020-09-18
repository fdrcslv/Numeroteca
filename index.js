var app = new Vue({
  el:'#app',
  data:{
    numbers:{

    }
  },
  methods:{
    is_odd: function(n){
      return n % 2 != 0
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
      return n.toString().reverse() == n
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
    is_binary:  function simpleForLoop(n){
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
  computed:{

  },
  watch:{

  }
})
