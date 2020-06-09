function resizeProductHeight() {
  var maxHeight = -1;
  $('.producto-blog-contenedor').each(function() {
    $(this).height('initial');
  });

  $('.producto-blog-contenedor').each(function() {
    maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
  });

  $('.producto-blog-contenedor').each(function() {
    $(this).height(maxHeight);
  });
}

$(document).ready(function() {
  resizeProductHeight();
});

$(window).resize(function(){
  resizeProductHeight();
});
