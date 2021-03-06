var _modalURL,
    ModalModel = (function () {
        'use strict';
        var modalMap = {
                category: '',
                title: '',
                article: '',
                date: '',
                header: '',
                className: '',
                invis: '',
                dateInvis: '',
            };

        return {
            getData: function (modal_id, _modalURL) {
                $.ajax({
                   url: _modalURL,
                   method: 'POST',
                   headers: {
                       "Accept": "application/json; odata=verbose",
                       "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                       "context-type": "application/json; odata=verbose"
                   },
                   success: function (data) {
                       //console.log(data);
                       ModalModel.setData(modal_id, data);
                   },
                   error: function(jqxhr) {
                     console.log(jqxhr.statusText);
                   }
                 });               
            },

            setData: function(modal_id, data) {
                if (modal_id === '[data-announcements]') {
                    var startDate = data.d.results[0].StartDate || '',
                        newDate = (startDate) ? new Date(startDate) : '';
                    newDate = (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear();
                    modalMap.date = newDate;
                    modalMap.title = data.d.results[0].Title || '';
                    modalMap.category = (data.d.results[0].RHAnncmtCategory) ? data.d.results[0].RHAnncmtCategory.Label : '';
                    modalMap.article = data.d.results[0].Body || '';
                    modalMap.header = "ANNOUNCEMENT";
                    modalMap.className = 'bg-slate';
                    modalMap.invis = 'invisible';
                    modalMap.dateInvis = '';
                } else if (modal_id === '[data-events]') {
                    var startDate = data.d.StartDate || '',
                        newDate = (startDate) ? new Date(startDate) : '';
                    newDate = (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear();
                    modalMap.date = newDate;
                    modalMap.title = data.d.Title || '';
                    modalMap.category = '';
                    modalMap.article = data.d.Comments || '';
                    modalMap.header = "EVENT";
                    modalMap.className = 'bg-slate';
                    modalMap.invis = '';
                    modalMap.dateInvis = 'invisible';
                }
                $('body').trigger('dataLoaded');
            },

            loadData: function () {
                var data = {
                    category: modalMap.category,
                    title: modalMap.title,
                    article: modalMap.article,
                    date: modalMap.date,
                    header: modalMap.header,
                    className: modalMap.className,
                    invis: modalMap.invis,
                    dateInvis: modalMap.dateInvis
                };
                return data;
            },

            loadContent: function () {
                var content = '<div class="large-18 large-centered medium-18 medium-centered small-20 modal-lean-interior bg-white columns"><div class="row"><div class="small-21 {{className}} txt-white columns"><div class="row"><div class="small-19 small-push-2 columns"><div class="modal-header">{{header}}</div><div class="modal-button-close"><a data-close-modal>x</a></div></div></div></div></div><div class="row"><div class="small-21 columns"><div class="row"><div class="small-18 small-push-2 modal-content columns"><div class="modal-date txt-grey-mid {{invis}}" data-date>{{date}}</div><div class="modal-title  txt-grey-mid">{{title}}</div><div class="modal-category {{dateInvis}}">{{category}}</div><div class="modal-body">{{{article}}}</div><div class="modal-posted txt-grey {{dateInvis}}">posted <span data-date>{{date}}</span></div></div></div></div></div></div>';
                return content;
            }
        };
    })();

$.fn.extend({
    tpModal: function () {
        var $overlay = $('#mask'),
            count;
        $('body').on('click', '.tile-content [data-modal]', function (ev) {
            count = 0;
            ev.preventDefault();
            _modalURL = $(this).data('url');
            if (_modalURL) {
                $('#loading').removeClass('invisible');
                if ($('body').hasClass('ie-8')) {
                    $overlay.css('opacity', '.7');
                    $overlay.removeClass('invisible');
                } else {
                    $overlay.css('opacity', '.7');
                    $overlay.fadeIn('fast').removeClass('invisible');
                }
            } else {
                return false;
            }
            var modal_id = $(this).attr('href'),
                $modal = $(modal_id),
                close_modal = function (modal_id) {
                    if ($modal.is(':visible')) {
                        if ($('body').hasClass('ie-8')) {
                            $overlay.addClass('invisible');
                        } else {
                            $overlay.fadeOut('fast').addClass('invisible');
                        }
                        $modal.children().remove();
                        $modal.css('display', 'none');
                    }
                };
             $overlay
                .click(function () {
                    close_modal(modal_id);
                });                
             $.when(ModalModel.getData(modal_id, _modalURL))
                .then(function () {
                    if (count === 0) {
                        $('body').on('dataLoaded', function () {
                            $('#loading').addClass('invisible'); 
                            count = 1;
                            var content = ModalModel.loadContent(),
                                data = ModalModel.loadData(),
                                template = Handlebars.compile(content),
                                context = data,
                                html = template(context);                                  
                            $modal.children().remove();
                            $modal.css('display', 'none');
                            $modal
                                .css({
                                    display: 'block',
                                    overflow: 'hidden',
                                    position: 'fixed',
                                    top: '100px',
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    zIndex: 999
                                 })
                                 .fadeTo(200, 1)
                                 .append(html);                           
                         });
                     }
                });
                
            $('body').on('click', '[data-close-modal]', function () {
                close_modal(modal_id);
            });
        });
    }
});
