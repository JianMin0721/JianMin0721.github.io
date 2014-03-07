$(document).ready(function () {
    $(".code").each(function(i){
          $(this).find("span").each(function(i){
          	   if(i<9){
          	       $("<span class=\"spline\">"+"0"+(i+1)+"</span>").insertBefore($(this));
          	   }
          	   else{
          	   	   $("<span class=\"spline\">"+ (i+1)+"</span>").insertBefore($(this));
          	   }
               
        });
    });
});