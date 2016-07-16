(function() {
  // http://www.zachstronaut.com/posts/2009/01/18/jquery-smooth-scroll-bugs.html
  var scrollElement = 'html, body';
  var $scrollElement;

  /* let's check browser support with modernizr */

    (function() {
      if(!Modernizr.csstransforms3d)
        {
          $(function() {
              var notify = function(message) {
                  var $message = $('<p style="display:none; color:red; font-size:13px;">' + message + '</p>');
                  $('.notifications').append($message);
                  $message.slideDown(300, function() {
                      window.setTimeout(function() {
                        $message.slideUp(600, function() {
                          $message.remove();
                          });
                       }, 2000);
                  });
                };
                notify('CSS 3D transforms are not supported in your browser');
            });
        }
    })();

  Modernizr.addTest('firefox', function () {
    return !!navigator.userAgent.match(/firefox/i);
  });

var classList = document.documentElement.className.split(/\s+/);
var firefox = false;

$.each(classList, function (index, item) {
  console.debug("Testando o navegador! %s", item);
  if (item == "firefox") {
    firefox = true;
  }
});

  console.debug("Estou usando o firefox: %s",firefox);

/* Page slider code */
  $(function() {
    $('html, body').each(function () {
      var initScrollLeft = $(this).attr('scrollLeft');

      $(this).attr('scrollLeft', initScrollLeft + 1);
      if ($(this).attr('scrollLeft') == initScrollLeft + 1) {
        scrollElement = this.nodeName.toLowerCase();
        $(this).attr('scrollLeft', initScrollLeft);
        return false;
      }
    });
    $scrollElement = $(scrollElement);
  });

  /* Smooth scrolling of links between panels */
  $(function() {
    var $panels = $('.panel');

    $panels.each(function() {
      var $panel = $(this);
      var hash = '#' + this.id;

      $('a[href="' + hash + '"]').click(function(event) {
        $scrollElement.stop().animate({
          scrollLeft: $panel.offset().left
        }, 500, 'swing', function() {
          window.location.hash = hash;
        });

        event.preventDefault();
      });
    });
  });

  /* Panel waypoints for setting high-level location classes on body. */
  $(function() {
    var $body = $('body');

    $('.panel')
      .waypoint(function(direction) {
        console.debug("Initializing: %s",direction);
        $body.removeClass("english-visible portuguese-visible spanish-visible");
        $body.addClass(this.element.id + '-visible', direction === 'right');
      }, {
        offset: '50%',
        horizontal: true
      })
      .waypoint(function(direction) {
        console.debug("Initializing2: %s",direction);
        $body.removeClass("english-visible portuguese-visible spanish-visible");
        $body.addClass(this.element.id + '-visible', direction === 'left');
      }, {
        offset: '-50%',
        horizontal: true
      });
  });

  /* Force snap to panel on resize. */
  $(function() {
    var $window = $(window);
    var timer;

    $window.resize(function() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function() {
        var hash = window.location.hash ? window.location.hash : '#english';

        $scrollElement.stop().animate({
          scrollLeft: $(hash).offset().left
        }, 200);
      }, 100);
    });
  });

  /* Fix scroll snapping during browser finds */
  $(function() {
    var $window = $(window);
    var timer;

    /* Most finds will scroll a single panel. */
    var scrollToPanel = function(panel) {
      $scrollElement.scrollLeft($(panel).offset().left);
    };

    /* Others will scroll between panels but not cause a panel scroll */
    var scrollToClosestPanel = function() {
      var currentScroll = $window.scrollLeft();
      var panelOffsets = $.map($('.panel').get(), function(el) {
        return $(el).offset().left;
      });
      var closestOffset = 0;
      var closestDistance = 99999999;

      $.each(panelOffsets, function(i, offset) {
        var offsetDistance = Math.abs(currentScroll - offset);
        if(offsetDistance < closestDistance) {
          closestDistance = offsetDistance;
          closestOffset = offset;
        }
      });
      $scrollElement.scrollLeft(closestOffset);
    };

    $('.panel').scroll(function() {
      window.clearTimeout(timer);
      if(firefox)
      {
        timer = window.setTimeout(scrollToPanel, 250, this);
      }
      else
      {
        timer = window.setTimeout(scrollToPanel, 50, this);
      }
    });

    /* 50ms is enough time to let the animation between panels do its
       thing without triggering this debounced panel snap. */
    $window.scroll(function() {
      window.clearTimeout(timer);
      if(firefox)
      {
        timer = window.setTimeout(scrollToClosestPanel, 250);
      }
      else
      {
        timer = window.setTimeout(scrollToClosestPanel, 50);
      }
    });
  });

  /* Docs nav highlighting */
  /*$(function() {
    $('.doc-section')
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'down');
      }, {
        context: '#docs',
        offset: '100%'
      })
      .waypoint(function(direction) {
        var $links = $('a[href="#' + this.id + '"]');
        $links.toggleClass('active', direction === 'up');
      }, {
        context: '#docs',
        offset: function() {
          return -$(this).height();
        }
      });
  });*/

  /* Get Started section notification examples */
  $(function() {
    var notify = function(message) {
      var $message = $('<p style="display:none;">' + message + '</p>');

      $('.notifications').append($message);
      $message.slideDown(300, function() {
        window.setTimeout(function() {v
          $message.slideUp(300, function() {
            $message.remove();
          });
        }, 2000);
      });
    };

    $('#example-basic').waypoint(function() {
     notify('Basic example callback triggered.');
    }, { context: '.content' });

    $('#example-direction').waypoint(function(direction) {
      notify('Direction example triggered scrolling ' + direction);
    }, { context: '.content' });

    $('#example-offset-pixels').waypoint(function() {
      notify('100 pixels from the top');
    }, {
      offset: 100,
      context: '.sidepanel'
    });

    $('#example-offset-percent').waypoint(function() {
      notify('25% from the top');
    }, {
      offset: '25%',
      context: '.sidepanel'
    });

    $('#example-offset-function').waypoint(function() {
      notify('Element bottom hit window top');
    }, {
      offset: function() {
        return -$(this).height();
      },
      context: '.sidepanel'
    });

    $('#example-context').waypoint(function() {
      notify('Hit top of context');
    }, { context: '.example-scroll-div' });

    $('#example-handler').waypoint({
      handler: function() {
        notify('Handler option used');
      },
      offset: '50%',
      context: '.sidepanel'
    });
  });

  /* Centering for About and Shortcut panels */
  /*$(function() {
    var $window = $(window);
    var $centered = $('#about .inner, #shortcuts-examples .inner')

    var center = function() {
      var winHeight = $.waypoints('viewportHeight');

      $centered.each(function() {
        var $el = $(this);
        var top = (winHeight - $el.height()) / 2;

        top = top > 60 ? top : 60;
        $el.css('top', top);
      })
    };

    center();
    $window.load(center).resize(center);
  });*/
 /* PFold js */
    /*$(function() {
        var $container = $( '#uc-container' ),
            pfold = $( '#uc-container' ).pfold({
                easing : 'ease-in-out',
                folds : 6,
                folddirection : ['right','right','right','top','top','bottom']
        });

        $container.find( 'span.clickme' ).on( 'click', function() {
            pfold.unfold();
        } ).end().find( 'span.close' ).on( 'click', function() {
            pfold.fold();
        } );
    });*/
    /* Footer position fix */
    $(function() {
        console.log("QUem é maior? %s ou %s", $( 'div.sidepanel' ).height(), window.innerHeight);
        if( $( 'div.sidepanel' ).height() + 196 < window.innerHeight )
        {
            $( 'div.footer' ).css({'bottom':'5px'});
        }
        else
        {
            $( 'div.footer' ).css({'top':'calc( 525px + 23% )'});
        }
    });

    /*PFOLD functions*/
    $(function() {
        // say we want to have only one item opened at one moment
        var opened = false;
        console.debug("inicializei o opended");
        var open;

        $( '#grid > div.uc-container' ).each( function( i ) {
            console.debug("%s", i);
            var $item = $( this ), direction;
            direction = ['bottom','right','top','right','top','right','bottom','final'];

            var pfold = $item.pfold( {
            folddirection : direction,
            //easing : 'ease-in-out',
            speed : 180,
            folds: 8,
            centered : true
            } );
            //Open HOME paper at Startup
            if( i === 0 ) {
            $item.find( 'span.clickme' ).ready( function() {
              opened = true;
                        open = pfold;
                        pfold.unfold();
            });
            }

            $item.find( 'span.clickme' ).on( 'click', function() {
                console.debug("ENTRANDO opened = %s",opened);
                if( !opened ) {
                    pfold.support = document.getElementById("effects").checked;
                    opened = true;
                    open = pfold;
                    console.debug("FECHADO pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    pfold.unfold();
                    }
                else {
                    console.debug("ABERTO 1 pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    open.fold();
                    open = pfold;
                    pfold.support = document.getElementById("effects").checked;
                    pfold.unfold();
                    console.debug("ABERTO 2 pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    /*opened = true;*/
                }
                console.debug("SAINDO opened = %s",opened);
            } ).end().find( 'span.close' ).on( 'click', function() {
            pfold.fold();
            console.debug("FECHANDO opened = %s",opened);
            } );
            // Remove initial container
            console.debug("%s",$item.find( 'div.uc-initial')[0]);
            $item.find( 'div.uc-initial')[0].remove();
        } );
        $( '#grid1 > div.uc-container' ).each( function( i ) {
            var $item = $( this ), direction;
            direction = ['bottom','right','top','right','top','right','bottom','final'];

            var pfold = $item.pfold( {
            folddirection : direction,
            //easing : 'ease-in-out',
            speed : 180,
            folds: 8,
            centered : true
            } );

            $item.find( 'span.clickme' ).on( 'click', function() {
                console.debug("ETRANDO opened = %s",opened);
                if( !opened ) {
          pfold.support = document.getElementById("effects").checked;
                    opened = true;
                    open = pfold;
                    console.debug("FECHADO pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    pfold.unfold();
                    }
                else {
                    console.debug("ABERTO 1 pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    open.fold();
                    open = pfold;
          pfold.support = document.getElementById("effects").checked;
                    pfold.unfold();
                    console.debug("ABERTO 2 pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    /*opened = true;*/
                }
                console.debug("SAINDO opened = %s",opened);
            } ).end().find( 'span.close' ).on( 'click', function() {
            pfold.fold();
            console.debug("FECHANDO opened = %s",opened);
            } );
            // Remove initial container
            console.debug("%s",$item.find( 'div.uc-initial')[0]);
            $item.find( 'div.uc-initial')[0].remove();
        } );
        $( '#grid2 > div.uc-container' ).each( function( i ) {
            var $item = $( this ), direction;
            direction = ['bottom','right','top','right','top','right','bottom','final'];

            var pfold = $item.pfold( {
            folddirection : direction,
            //easing : 'ease-in-out',
            speed : 180,
            folds: 8,
            centered : true
            } );

            $item.find( 'span.clickme' ).on( 'click', function() {
                console.debug("ETRANDO opened = %s",opened);
                if( !opened ) {
          pfold.support = document.getElementById("effects").checked;
                    opened = true;
                    open = pfold;
                    console.debug("FECHADO pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    pfold.unfold();
                    }
                else {
                    console.debug("ABERTO 1 pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    open.fold();
                    open = pfold;
          pfold.support = document.getElementById("effects").checked;
                    pfold.unfold();
                    console.debug("ABERTO 2 pfold = %s, open = %s, opened = %s",pfold,open,opened);
                    /*opened = true;*/
                }
                console.debug("SAINDO opened = %s",opened);
            } ).end().find( 'span.close' ).on( 'click', function() {
            pfold.fold();
            console.debug("FECHANDO opened = %s",opened);
            } );
            // Remove initial container
            console.debug("%s",$item.find( 'div.uc-initial')[0]);
            $item.find( 'div.uc-initial')[0].remove();
        } );
    });
})();


