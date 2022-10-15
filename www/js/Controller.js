var Controller = function() {
    var controller = {
        self: null,
        initialize: function() {
            self = this;
            self.renderMainView();
        },

        bindEvents: function() {
            $('.link-home').on('click', this.onBackButtonClick);
            $('.tab-back-button').on('click', this.onBackButtonClick);
            $('.tab-button').on('click', this.onTabClick);
        },

        onTabClick: function(e) {
            e.preventDefault();
            
            var tab = $(this).data('tab');
            if (tab === '#sobre-tab') {
                self.renderSobreView();
            } else if (tab === '#contato-tab') {
                self.renderContatoView();
            } else if (tab === '#teste-tab'){
                self.renderTesteView();
            }
        },

        onBackButtonClick: function(e) {
            e.preventDefault();
            
            self.renderMainView();
        },


        renderPostView: function() {
            $('.tab-button').removeClass('active');
            $('#post-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/post-project-view.html", function(data) {
                $('#tab-content').find('#post-project-form').on('submit', self.postProject);
            }); 
        },

        renderMainView: function() {
            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/main-view.html", function(data) {
                // $('#tab-content').find('#post-project-form').on('submit', self.postProject);
                self.bindEvents();
            }); 
        },

        renderContatoView: function() {
            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/contato-view.html", function(data) {
                // $('#tab-content').find('#post-project-form').on('submit', self.postProject);
                self.bindEvents();
            }); 
        },
       
        renderSobreView: function() {
            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/sobre-view.html", function(data) {
                // $('#tab-content').find('#post-project-form').on('submit', self.postProject);
                self.bindEvents();
            }); 
        },
        
        renderTesteView: function() {
            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/teste-view.html", function(data) {
                quizMaster.execute("./js/questions.json", ".quizdisplay", function(result) {
                    console.log("SUCESS CB");
                    console.dir(result);	
                });
            }); 
        },
       
        renderSearchView: function() {
            $('.tab-button').removeClass('active');
            $('#search-tab-button').addClass('active');

            var $tab = $('#tab-content');
            $tab.empty();

            var $projectTemplate = null;
            $("#tab-content").load("./views/search-project-view.html", function(data) {
                $projectTemplate = $('.project').remove();
                // Load projects here
            }); 
        }
    }
    controller.initialize();
    return controller;
}