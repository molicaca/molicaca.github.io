  $(document).ready(function(){
var mark;
  $(function() {
    $( "#radioer" ).buttonset();
  });
  
  $(function() {
	    // ҳ����أ���ֵ
	    mark = $("[name='radio'][checked]").val();
  });
  
  $("[name='radio']").click(function() {
      // ������Ҫ����
      mark = $(this).val();
      $( "#zhukai" ).html(mark);
  });
  


    $("button").click(function(){
      $("p").css("background-color","red");
    //  mark = $(this).val();
      $( "#zhukai" ).html(mark);
    });
  });
