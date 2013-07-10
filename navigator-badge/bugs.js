// These are 'bugs' on the page that need to be fixed by the
// user.

var bugs = (function() {
  var totalToEarn = 0;
  var earned = 0;
  
  function win() {
    $('html').scrollTop( $('#badge').offset().top );
    $(".help").hide();
    $("#win").fadeIn();
    $("#win form").submit(function() {
      var email = $(this).find("input#email").val().trim();
      if (QuickBadge.validateEmail(email)) {
        var baseURI = $('<a href="./"></a>')[0].href;
        var publish = QuickBadge.publish({
          service: "http://hackpub.hackasaurus.org/publish",
          assertion: {
            "recipient": email,
            "badge": {
              "version": "0.0.1",
              "name": "Navigieren im Web",
              "image": $("#badge")[0].src,
              "description": "Kann mit einem Web Browser sicher und zielgerichtet surfen.",
              "criteria": baseURI,
              "issuer": {
                "origin": "http://coderdojo-salzburg.at/",
                "name": "CoderDojo Salzburg",
                "org": "CoderDojo Salzburg",
                "contact": "badges@coderdojo-salzburg.at"
              }
            }
          }
        });
        $("#win form").fadeOut(function() {
          $("#throbber").fadeIn(function() {
            publish.fail(function() {
              alert("Hoppala, da ist ein Fehler aufgetreten, probier es später nochmal.");
              $("#win form").show();
              $("#throbber").hide();
            });
            publish.done(function(url) {
              $("#throbber").fadeOut();
              QuickBadge.issue(url, {
                success: function() {
                  $("#win .instructions").hide();
                },
                error: function(info) {
                  $("#win form").show();
                  $("#throbber").hide();
                  console.log("error", info);
                }
              });
            });
          });
        });
      } else
        alert("Diese E-Mail Adresse schaut nicht gut aus - bitte gib eine richtige E-Mail ein.");
      return false;
    });
  }
  
  function achieve(cb) {
    totalToEarn++;
    return function() {
      earned++;
      cb();
      if (earned == totalToEarn)
        win();
    }
  }
  
  //setTimeout(win, 1000);
  
  return {
    selecter: {
      isFixed: function() {
        var selObj = window.getSelection();
        if (this.achieved)
          return true;
        if (selObj.toString() == $("#select-me").text()) {
          this.achieved = true;
          return true;
        }
        return false;
      },
      achievement: "#selecter",
      onAchieved: achieve(function() {
        console.log("achieved selecter");
      })
    },
    paster: {
      isFixed: function() {
        return ($("#paster-field").val() == $("#select-me").text());
      },
      achievement: "#paster",
      onAchieved: achieve(function() {
        console.log("achieved");
        // $("#paster-field").parent().slideUp();
        // $("#select-me").slideUp();
      })
    },
    massivePaster: {
      isFixed: function() {
        return ($("#massive-paster-field").val() == $("#massive").text());
      },
      achievement: "#massive-paster",
      onAchieved: achieve(function() {
        $("#massive-challenge").slideUp();
      })
    },
    addressBarHacker: {
      isFixed: function() {
        return (window.location == $('#url-paster-field').val());
      },
      achievement: "#address-bar-hacker",
      onAchieved: achieve(function() {
      })
    },
    linker: {
      isFixed: function() {
        return ($("#linker-field").val() == $("#supergirl")[0].src);
      },
      achievement: "#linker",
      onAchieved: achieve(function() {
        console.log("achieved linker");
        // $("#linker-field").parent().slideUp();
      })
    }
  };
})();
