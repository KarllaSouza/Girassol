/* global $,window */
var quizMaster = (function () {
	var name;
	var data;
	var loaded = false;
	var displayDom;
	var successCbAlias;

	function nextHandler(e) {
		e.preventDefault();

		var status = getUserStatus();

		//if we aren't on the intro, then we need to ensure you picked something
		if(status.question >= 0) {
			var checked = $("input[type=radio]:checked", displayDom);
			if(checked.length === 0) {
				//for now, an ugly alert
				window.alert("Por favor escolha uma alternativa!");
				return;
			} else {
				status.answers[status.question] = checked.val();	
			}
		} 
		status.question++;
		storeUserStatus(status);
		displayQuiz(successCbAlias);
	}

	function backHandler(e) {
		e.preventDefault();

		var status = getUserStatus();
		if(status.question === 0) {
			status = null;
			storeUserStatus(status);
			backIndexHandler(e);
		} else {
			status.question--;
			storeUserStatus(status);
			displayQuiz(successCbAlias);
		}
	}

	function backIndexHandler(e) {
		e.preventDefault();
		removeUserStatus();
		loaded = false;
		return new Controller();
	}

	function displayQuiz(successCb) {

		//We copy this out so our event can use it later. This feels wrong
		successCbAlias = successCb;
		var current = getQuiz();
		var html;

		if(current.state === "introduction") {
			html = "<h2>Introduction</h2><p>" + current.introduction + "</p>" + nextButton();
			displayDom.html(html).trigger('create');
		} else if(current.state === "inprogress") {
			
			html = "<h2 id='enunciado' class='justificado'>" + current.question.pergunta + "</h2><form id='quizForm'><div data-role='fieldcontain'><fieldset data-role='controlgroup'>";
			for(var i=0; i<current.question.alternativas.length; i++) {
				html += "<input type='radio' name='quizMasterAnswer' id='quizMasterAnswer_"+i+"' value='"+i+"'/><label data-icon='false' for='quizMasterAnswer_"+i+"'>" + current.question.alternativas[i].alternativa + "</label>";
			}
			html += "</fieldset></div></form>" + nextButton() + backButton();
			displayDom.html(html).trigger('create');
		} else if(current.state === "complete") {
			if(current.correct <= 18){
				html = "<h2>Resultado</h2><p class='justificado'>Usuário normal.</p><p> Sua pontuação "+current.correct+".</p>";
			} else if (current.correct >= 19 && current.correct <= 33) {
				html = "<h2>Resultado</h2><p class='justificado'>Você é um utilizador médio. Por vezes poderá até navegar na Internet um pouco demais, no entanto, tem controle sobre a sua utilização.</p><p> Sua pontuação "+current.correct+".</p>";
			} else if (current.correct >= 34 && current.correct <= 63) {
				html = "<h2>Resultado</h2><p class='justificado'>Você começa a ter problemas ocasionais ou frequentes devido ao uso da Internet. Deve considerar o impacto na sua vida por ficar ligado à Internet com frequência.</p><p> Sua pontuação "+current.correct+".</p>";
			} else if (current.correct >= 64) {
				html = "<h2>Resultado</h2><p class='justificado'>A utilização da Internet está causando problemas significativos na sua vida. Deve avaliar as consequências destes impactos e aprender a lidar com a internet de modo mais saudável e produtivo.</p><p> Sua pontuação "+current.correct+".</p>";
			}
			html += homeButton();

			displayDom.html(html).trigger('create');
			removeUserStatus();
			successCb(current);
		}
		
		//Remove previous if there...
		//Note - used click since folks will be demoing in the browser, use touchend instead
		displayDom.off("click", ".quizMasterNext", nextHandler);
		displayDom.off("click", ".quizMasterBack", backHandler);
		displayDom.off("click", ".quizMasterHome", backIndexHandler);

		//Then restore it
		displayDom.on("click", ".quizMasterNext", nextHandler);
		displayDom.on("click", ".quizMasterBack", backHandler);
		displayDom.on("click", ".quizMasterHome", backIndexHandler);
		
	}

	function nextButton() {
		return "<a href='' class='quizMasterNext' data-role='button'>Próximo</a>";	
	}

	function backButton() {
		return "<a href='' class='quizMasterBack' data-role='button'>Voltar</a>";	
	}

	function homeButton() {
		return "<a href='' class='quizMasterHome' data-role='button'>Inicio</a>";	
	}
	
	function getKey() {
		return "quizMaster_"+name;	
	}
	
	function getQuestion(x) {
		return data.perguntas[x];	
	}
	
	function getQuiz() {
		//Were we taking the quiz already?
		var status = getUserStatus();
		if(!status) {
			status = {question:-1,answers:[]};
			storeUserStatus(status);
		}
		//If a quiz doesn't have an intro, just go right to the question
		if(status.question === -1 && !data.introduction) {
			status.question = 0;
			storeUserStatus(status);
		}

		var result = {
			currentQuestionNumber:status.question
		};
		
		if(status.question == -1) {
			result.state = "introduction";
			result.introduction = data.introduction;	
		} else if(status.question < data.perguntas.length) {
			result.state = "inprogress";
			result.question = getQuestion(status.question);	
		} else {
			result.state = "complete";
			result.correct = 0;
			for(var i=0; i < data.perguntas.length; i++) {
				result.correct += data.perguntas[i].alternativas[status.answers[i]].valor;
			}
		}
		return result;
	}
	
	function getUserStatus() {
		var existing = window.sessionStorage.getItem(getKey());
		if(existing) {
			return JSON.parse(existing);
		} else {
			return null;
		}
	}
		
	function removeUserStatus(s) {
		window.sessionStorage.removeItem(getKey());	
	}
	
	function storeUserStatus(s) {
		window.sessionStorage.setItem(getKey(), JSON.stringify(s));
	}
	
	return {
		execute: function( url, dom, cb ) {
			//We cache the ajax load so we can do it only once 
			if(!loaded) {
				
				document.addEventListener("backbutton", function(e){
					backHandler(e);
				 }, false)

				$.getJSON(url, function(res, code) {
					//Possibly do validation here to ensure basic stuff is present
					name = url;
					data = res;
					displayDom = $(dom);
					//console.dir(res);
					loaded = true;
					displayQuiz(cb);
				});
				
			} else {
				displayQuiz(cb);
			}
		}
	};
}());