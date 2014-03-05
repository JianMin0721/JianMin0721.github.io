$(document).ready(function () {
    $(".code").each(function(i){
          $(this).find("span").each(function(i){
               $("<span class=\"spline\">"+(i+1)+"</span>").insertBefore($(this));
        });
    });
});