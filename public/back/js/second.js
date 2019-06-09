$(function(){
    var currentPage = 1;
    var pageSize = 5;

    // 1.一进入页面发送ajax请求，获取数据，通过模板引擎渲染
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType: "json",
            success:function(info){
                console.log(info);
                    var htmlStr = template("secondTpl",info);
                    $("tbody").html(htmlStr);

                // 分页初始化
                $("#paginator").bootstrapPaginator({
                    // 指定版本
                    bootstrapMajorVersion:3,
                    // 总页数
                    totalPages:Math.ceil(info.total / info.size),
                    // 当前页
                    currentPage: info.page,

                    // 给页码添加点击事件
                    onPageClicked: function(a,b,c,page){
                        currentPage = page;
                        // 页面重新渲染
                        render();
                    }

                });

            }
        })
    }

    // 2.点击分类按钮 显示模态框
     $("#addBtn").click(function(){
         $("#addModal").modal("show");

         // 一点击分类按钮就发送ajax请求 获取数据 通过模板引擎渲染
         // 通过设置 page=1  pageSize=100 来模拟数据
         $.ajax({
             type:"get",
             url:"/category/queryTopCategoryPaging",
             data: {
                 page:1,
                 pageSize:100
             },
             dataType:"json",
             success:function(info){
                 console.log(info);
                 var htmlStr = template("dropdownTpl", info);
                 $(".dropdown-menu").html(htmlStr);
             }
         })
     })

    // 3.通过事件委托 给 dropdown-menu 下面所有的 a 绑定点击事件
    $(".dropdown-menu").on("click","a", function(){
        // 获取 a 的文本
        var txt = $(this).text();
        // 把这个文本赋值给 ul
         $("#dropdownText").html(txt);

         // 获取选中的一级分类中 a 的 id
        var id = $(this).data( 'id' );
         // 把id 赋值给input框（val）
        $('[name="categoryId"]').val(id);

        // 将隐藏的校验状态设置成 校验成功的状态 利用插件的 updateStatus
        // updateStatus(字段名称 ，校验状态， 校验规则)
        $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });

    // 文件上传思路整理
    // 1，引包
    //  2 准备结构 name  data-url
    //  3 进行文件上传初始化 配置 done 回调函数

    // 4.进行文件上传初始化
    $("#fileupload").fileupload({
        // 配置返回的数据格式
        dataType:"json",
        // 配置图片上传完成后会调用的 done 回调函数
        done:function( e, data ){
            var imgUrl = data.result.picAddr;
            $("#imgBox img" ).attr("src",imgUrl);

            $('[name="brandLogo"]').val( imgUrl );

            // 将隐藏的校验状态设置成 校验成功的状态 利用插件的 updateStatus
            // updateStatus(字段名称 ，校验状态， 校验规则)
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    });

    // 5 实现表单校验
  $("#form").bootstrapValidator({
      //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
      // 我们需要对隐藏域进行校验 所以不需要将隐藏域排除到校验范围外 所以设置为 空
      excluded: [],

      //配置图标
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',  //校验成功  valid：有效的
          invalid: 'glyphicon glyphicon-remove',   // 校验失败 invalid:无效
          validating: 'glyphicon glyphicon-refresh'  //validating:校验中
      },
      // 配置字段
      fields:{
          // 字段名称
          categoryId:{
            // 校验规则
              validators:{
                  notEmpty:{
                      message:"请选择一级分类"
                  }
              }
         },
          brandName:{
              validators:{
                  notEmpty:{
                      message:"请输入二级分类"
                  }
              }
          },
          brandLogo:{
              validators:{
                  notEmpty:{
                      message:"请上传图片"
                  }
              }
          }
      }
  });

  // 6.注册表单校验成功事件，阻止默认提交，通过ajax提交
 $("#form").on("success.form.bv",function( e ){
     e.preventDefault();

     $.ajax({
         type:"post",
         url:"/category/addSecondCategory",
         data:$("#form").serialize(),
         dataType:"json",
         success:function(info){
             console.log(info);
             // 添加成功后
             // 1 关闭模态框
             $("#addModal").modal("hide");
             // 2 页面重新渲染 渲染第一页
             currentPage = 1;
             render();
             // 3 重置模态框表单 不仅重置样式 还有重置文本 所以要传 true
             $("#form").data("bootstrapValidator").resetForm(true);

             // 4.手动重置文本内容 和 图片路径
             $("#dropdownText").text("请选择一级分类");
             $("#imgBox img").attr("src","images/none.png");
         }
     })
 })



});