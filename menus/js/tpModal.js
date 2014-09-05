var _modalId,
    ModalModel = (function () {
        'use strict';
        var modalMap = {
            modalId: '',
            category: 'TEST CATEGORY',
            heading: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            article: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
            date: '07/01/14',
            owner: 'CONTENT OWNER',
            eventTitle: 'test title'
        };

        return {
            getData: function (_modalId, modal_id) {
                // $.ajax({
                //   url: '<URL>' + _modalId,
                //   method : 'GET',
                //   headers: { 'Accept': 'application/json; odata=verbose' },
                //   success: function (data) {
                //     console.log(data);
                //     if (modal_id === '[data-announcments]') {
                //       modalMap.category = data.category;
                //       modalMap.heading = data.heading;
                //       modalMap.article = data.article;
                //       modalMap.date = data.date;
                //       modalMap.owner = data.owner;
                //     } else {
                //       modalMap.eventTitle = data.eventTitle;
                //       modalMap.heading = data.heading;
                //       modalMap.article = data.article;
                //       modalMap.date = data.date;
                //     }
                //     modalMap.modalId = _modalId
                //   },
                //   error: function(jqxhr) {
                //     console.log(jqxhr.statusText);
                //   }
                // });

                modalMap.modalId = _modalId;
                return _modalId;
            },

            announcmentsData: function () {
                var data = {
                    id: modalMap.modalId,
                    category: modalMap.category,
                    heading: modalMap.heading,
                    article: modalMap.article,
                    date: modalMap.date,
                    owner: modalMap.owner
                };
                return data;
            },

            announcmentsContent: function () {
                var content = '<div data-id="{{id}}" class="large-18 large-centered medium-18 medium-centered small-20 modal-lean-interior bg-white columns"><div class="row"><div class="small-21 bg-slate txt-white columns"><div class="row"><div class="small-19 small-push-2 columns"><div class="modal-header">announcement</div><div class="modal-button-close"><a data-close-modal>x</a></div></div></div></div></div><div class="row"><div class="small-21 columns"><div class="row"><div class="small-18 small-push-2 columns"><div class="modal-category txt-grey-mid">{{category}}</div><div class="modal-content"><p class="txt-grey-dark">{{heading}}</p>{{{article}}}</div><div class="modal-posted txt-grey">posted {{date}}</div><div class="modal-owner txt-grey">by \'{{owner}}\'</div></div></div></div></div></div>';
                return content;
            },

            eventsData: function () {
                var data = {
                    id: modalMap.modalId,
                    eventTitle: modalMap.eventTitle,
                    heading: modalMap.heading,
                    article: modalMap.article,
                    date: modalMap.date
                };
                return data;
            },

            eventsContent: function () {
                var content = '<div data-id="{{id}}" class="large-18 large-centered medium-18 medium-centered small-20 modal-lean-interior bg-white columns"><div class="row"><div class="small-21 bg-jade txt-white columns"><div class="row"><div class="small-19 small-push-2 columns"><div class="modal-header">{{eventTitle}}</div><div class="modal-button-close"><a data-close-modal>x</a></div></div></div></div></div><div class="row"><div class="small-21 columns"><div class="row"><div class="small-18 small-push-2 columns"><div class="modal-date txt-grey-mid">{{date}}</div><div class="modal-content txt-grey-dark"><p>{{heading}}</p>{{{article}}}</div></div></div></div></div></div>';
                return content;
            }
        };
    })();

$.fn.extend({
    tpModal: function () {
        var overlay = $('#mask');
        return $('[data-modal]').each(function (i, el) {
            $('body').on('click', '[data-modal]', function (ev) {
                overlay.fadeIn('fast').removeClass('invisible').css('top', '0px');
                ev.preventDefault();
                _modalId = $(ev.target).parent('a').data('id');
                var modal_id = $(ev.target).parent('a').attr('href'),
                    modal_height = $(modal_id).outerHeight(),
                    modal_width = $(modal_id).outerWidth(),
                    close_modal = function (modal_id) {
                        if ($(modal_id).is(':visible')) {
                            overlay.fadeOut('fast').addClass('invisible').css('top', '68px');
                            $(modal_id).css('display', 'none').children().remove();
                        }
                    };
                overlay
                  .click(function () {
                      close_modal(modal_id);
                  });
                $.when(ModalModel.getData(_modalId, modal_id))
                  .then(function () {
                      $(modal_id).children().remove();
                      var content = (modal_id === '[data-announcments]') ? ModalModel.announcmentsContent() : ModalModel.eventsContent(),
                          data = (modal_id === '[data-announcments]') ? ModalModel.announcmentsData() : ModalModel.eventsData(),
                          template = Handlebars.compile(content),
                          context = data,
                          html = template(context);
                      $(modal_id)
                        .css({
                            display: 'block',
                            overflow: 'hidden',
                            position: 'fixed',
                            top: '100px',
                            right: 0,
                            bottom: 0,
                            left: 0,
                            zIndex: 999,
                            maxWidth: '770px'
                        })
                        .fadeTo(200, 1)
                        .append(html);
                  });

                $('[data-close-modal]').click(function () {
                    close_modal(modal_id);
                });

            });
        });
    }
});