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
    typer: {
      isFixed: function() {
        var text_to_type = $("#totype").text();
        var text_found = $("#typer_input").text();
        var pattern = new RegExp( text_to_type, "i" );
        return pattern.exec( text_found );
      },
      achievement: "#typer",
      onAchieved: achieve(function() {
        $('#typer_input').addClass('done');
        console.log("achieved typer:");
      })
    },
    casemaster: {
      isFixed: function() {
        var a = $("#lower").val().trim();
        var b = $("#upper_lower").val().trim();
        var c = $("#upper").val().trim();

        var a_low = a.replace(/^a-zA-ZäüöÄÜÖß/,'').toLowerCase();
        var b_low = b.replace(/^a-zA-ZäüöÄÜÖß/,'').toLowerCase();
        var c_low = c.replace(/^a-zA-ZäüöÄÜÖß/,'').toLowerCase();

        return a.length > 1 &&                                 // lang genug 
               a_low == b_low && b_low == c_low &&             // alle drei gleich
               a == a_low &&                                   // erster wirklich kleinbuchstaben
               b.substr(0,1) == b.substr(0,1).toUpperCase() && // erster buchstabe von b ist gross
               b.substr(1)   == b.substr(1).toLowerCase() &&   // der rest ist klein
               c == c.toUpperCase();                           // letzter wirklich grossbuchstaben
      },
      achievement: "#casemaster",
      onAchieved: achieve(function() {
        $('#upper_lower_input').addClass('done');
        $('#output_name').html( $("#upper_lower").val().trim() );
        $("#casemaster").slideUp();
      })
    },
    deleter: {
      isFixed: function() {
        var t = $('#delete_from_this').text().replace(/\s+/g, ' ');
        return the_text_after_deletions == t;
      },
      achievement: "#address-bar-hacker",
      onAchieved: achieve(function() {
        $('#delete_from_this').addClass('done');
        $("#deleter").show();
      })
    }
  };
})();
