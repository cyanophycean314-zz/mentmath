
function Config(ao, ar, mo, mr, eo, er, ws) {
  this.addops = ao;
  this.addrange = ar;
  this.mulops = mo;
  this.mulrange = mr;
  this.expops = eo;
  this.exprange = er;
  this.weights = ws;
}
var configs = {
  "easy" : new Config([2,2], [1,100], [2,2], [1,20], [2,2], [[1,15], [2,2]], [1,1,1,1,1]),
  "hard" : new Config([2,3], [5,500], [2,2], [5,100], [2,2], [[5,25], [2,3]], [1,1,1,1,1])
}

function gen_rand_range(bounds) {
  return Math.floor(Math.random() * (bounds[1] - bounds[0])) + bounds[0];
}

function gen_weighted(weights) {
  //Given array of weights. Return weighted random of choosing certain index
  var prefixsums = weights.slice();
  for (var i = 1; i < weights.length; i++) {
    prefixsums[i] += prefixsums[i - 1];
  }
  var totalweight = prefixsums[prefixsums.length - 1];
  var val = Math.random() * totalweight;
  var ans = 0;
  while (ans < prefixsums.length && val > prefixsums[ans]) {
    ans++;
  }
  console.log(ans);
  return ans;
}

function Problem(diff) {
  this.diff = diff;

  this.args = [];
  var c = configs[diff];
  //2 arguments
  switch(gen_weighted(c.weights)) {
    //0-1 Add and Sub
    case 0:
      this.ops = '+';
      //fall through
    case 1:
      this.ops = (this.ops === '+') ? '+' : '-';

      var numargs = gen_rand_range(c.addops);
      for (var i = 0; i < numargs; i++) {
        this.args.push(gen_rand_range(c.addrange));
      }
      break;

    //2-3 Multiply and Divide
    case 2:
      this.ops = '*';
      //fall through
    case 3:
      this.ops = (this.ops === '*') ? '*' : '/';

      var numargs = gen_rand_range(c.mulops);
      for (var i = 0; i < numargs; i++) {
        this.args.push(gen_rand_range(c.mulrange));
      }

      //Make division nicer
      if (this.ops == '/') {
        for (var i = 1; i < numargs; i++) {
          this.args[0] *= this.args[i];
        }
      }
      break;

    //4 Power
    case 4:
      this.ops = '^';
      var numargs = gen_rand_range(c.expops);
      for (var i = 0; i < numargs; i++) {
        this.args.push(gen_rand_range(c.exprange[i]));
      }
      break;

    default:
      console.log("Error creating problem"); 
  }

  if (this.ops != '^') {
    this.ans = eval(this.toString());
  } else {
    this.ans = Math.pow(this.args[0], this.args[1]);
  }
}

Problem.prototype = {
  constructor: Problem,
  isRight: function(guess) {
    this.guess = guess;
    return this.ans == guess;
  },
  toString: function() {
    var probtext = "", numargs = this.args.length;
    for (var i = 0; i < numargs; i++) {
      probtext += this.args[i];
      if (i < numargs - 1) {
        probtext += " " + this.ops[i] + " ";
      }
    }
    return probtext;
  }
}



function MathTest(diff, time) {
  this.diff = diff;
  this.time = time;
  
  this.score = score;
  this.operations = ["+","*","-","/"];
  this.teston = false;
  this.problems = [];
}

MathTest.prototype = {
  constructor: MathTest,
  startTest: function() {
    this.updateTimer();
    this.addNewProb();
    this.score = 0;
    this.teston = true;
    this.updateDisplay();
  },
  updateTimer: function() {
    if (this.time == 0) {
      this.stopTest();
    } else {
      var that = this;
      this.ticker = setTimeout(function() {
        that.time--;
        that.updateTimer();
      }, 1000);
    }
    this.updateDisplay();
  },
  stopTest: function() {
    if (this.time > 0) {
      this.time = 0; 
      clearTimeout(this.ticker);
    }
    this.teston = false;
    this.updateDisplay();
  },
  addNewProb: function() {
    this.prob = new Problem(this.diff);
    this.updateDisplay();
  },
  updateDisplay: function () {
    $("#probdisp").css("visibility","visible");
    $("#score").text("Score: " + this.score);
    $("#clock").text("Time: " + this.time);
    if (this.teston) {
      $("#probdisp").text(this.prob.toString());
    } else {
      $("#probdisp").text("Score: " + this.score);
    }
  },
  checkAns: function (guess) {
    guess = Number(guess);
    if (this.prob.isRight(guess)) {
      this.score++;
      this.problems.push(this.prob);
      this.addNewProb();
      $("#ans").val("");
    }
  }
}

window.onload = function() {
  $("#ans").keyup(function(e) {
    //Check the answer
    if (typeof test == "object" && test.teston) {
      test.checkAns(e.target.value);
    }
  });

  $("#diffs").click(function(e) {
    if (typeof test == "object") {
      test.stopTest();
    }
    test = new MathTest(e.target.id, 90);
    test.startTest();
  });
}