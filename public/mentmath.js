
window.onload = function() {
    probdisp = document.getElementById("probdisp");
    ans = document.getElementById("ans");

    prob = loadnewquestion();

    ans.addEventListener("keyup", function(e) {
	//Check the answer
	if (prob.checkAns(e.target.value)) {
	    prob = loadnewquestion();
	    e.target.value = "";
	}
    });

    ans.focus();
}

function loadnewquestion() {
    var a = Math.floor(Math.random() * 10), b = Math.floor(Math.random() * 10);
    probdisp.innerHTML = a + " + " + b;
    return {
	checkAns : function(guess) {
	    return Number(guess) == a + b;
	}
    };
}
