var Controller = function() {
    var controller = {
        self: null,
        initialize: function() {
            self = this;
            self.renderMainView();
            // self.bindEvents(); 
        },

        bindEvents: function() {
            $('.tab-button').on('click', this.onTabClick);
        },

        onTabClick: function(e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }
            
            var tab = $(this).data('tab');
            if (tab === '#sobre-tab') {
                console.log("evento if");
                self.renderSobreView();
            } else {
                console.log("evento else");
                self.renderHistoriaView();
            }
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

        renderHistoriaView: function() {
            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/historia-view.html", function(data) {
                // $('#tab-content').find('#post-project-form').on('submit', self.postProject);
            }); 
        },
       
        renderSobreView: function() {
            var $tab = $('#tab-content');
            $tab.empty();
            $("#tab-content").load("./views/sobre-view.html", function(data) {
                // $('#tab-content').find('#post-project-form').on('submit', self.postProject);
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