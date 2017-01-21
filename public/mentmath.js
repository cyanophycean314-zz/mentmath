
function Problem(text) {
  this.text = text;
  this.ans = eval(text);
}

Problem.prototype = {
  constructor: Problem,
  isRight: function(guess) {
    this.guess = guess;
    return this.ans == guess;
  },
  toString: function() {
    return this.text;
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
    var args = [];
    var numargs = 2;
    var range = [1,50];
    if (this.diff == "hard") {
      if (Math.random() < 0.5) {
        numargs++;
      }
      if (Math.random() < 0.5) {
        range = [10,100];
      }
    }

    for (var i = 0; i < numargs; i++) {
      args.push(Math.floor(Math.random() * (range[1] - range[0])) + range[0]);
    }

    var ops = [];
    for (var i = 0; i < numargs - 1; i++) {
      ops.push(this.operations[Math.floor(Math.random() * this.operations.length)]);
    }

    //make the division problems nicer
    var startdiv = -1;
    for (var i = 0; i < numargs - 1; i++) {
      if (ops[i] == '/') {
        startdiv = (startdiv != -1 ? startdiv : i);
        args[startdiv] *= args[i + 1];
      } else {
        startdiv = -1;
      }
    }

    //display the problem
    var probtext = "";
    for (var i = 0; i < numargs; i++) {
      probtext += args[i];
      if (i < numargs - 1) {
        probtext += " " + ops[i] + " ";
      }
    }
    
    this.prob = new Problem(probtext);
    this.updateDisplay();
  },
  updateDisplay: function () {
    $("#probdisp").css("visibility","visible");
    $("#score").text("Score: " + this.score);
    $("#clock").text("Time: " + this.time);
    if (this.teston) {
      $("#probdisp").text(this.prob.text);
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