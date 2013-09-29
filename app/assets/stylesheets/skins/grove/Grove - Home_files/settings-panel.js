$(function() {



   $(".settings-panel").height($(document).height()-70);

   $(".settings-panel #color-grove").click(function(){
      $("link#grove-styles").attr("href", "css/styles-blue.css");
      return false;
   });

   $(".settings-panel #color-clean").click(function(){
      $("link#grove-styles").attr("href", "css/styles-cleanblue.css");
      return false;
   });

   $(".settings-panel #color-aqua").click(function(){
      $("link#grove-styles").attr("href", "css/styles-aqua.css");
      return false;
   });


   $(".settings-toggle #toggle").click(function(){
      $(".settings-panel").fadeToggle({duration:400});
      
      if ($(".settings-toggle").hasClass('toggled') === false) {
         $(".settings-toggle").addClass("toggled").children(".glyphicons").removeClass("tint").addClass("remove_2");
      } else {
         $(".settings-toggle").removeClass("toggled").children(".glyphicons").addClass("tint").removeClass("remove_2");
      }

      return false;
   });
});


// $(document).mouseup(function (e)
// {
//     var container = $(".settings-panel");
//     var toggler = $(".settings-toggle #toggle");

//     if (!container.is(e.target) && !toggler.is(e.target) && container.has(e.target).length === 0)
//     {
//         container.hide();
//     }
// });