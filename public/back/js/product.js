$(function(){
   //1. 一进入页面就发送ajax请求 获取数据 通过模板引擎渲染
   var currentPage = 1;
   var pageSize = 5;

   // 定义用来存储 已上传的图片的 数组
    var picArr = [];

   render();
   function render(){
       $.ajax({
           type:"get",
           url:"/product/queryProductDetailList",
           data:{
               page:currentPage,
               pageSize:pageSize
           },
           dataType:"json",
           success:function(info){
               // console.log(info);
               var htmlStr = template("productTpl",info);
               $(".lt_content tbody").html(htmlStr);

               // 分页初始化（插件）
               // 1.引包 2.准备容器 3.初始化
               $("#paginator").bootstrapPaginator({
                   // 指定版本
                   bootstrapMajorVersion:3,
                   // 当前页
                   currentPage:info.page,
                   // 总页数
                   totalPages: Math.ceil(info.total / info.size),
                   // size:"normal", 设置按钮的大小，mini, small, normal,large

                   // 设置按钮中文
                   // 每个按钮在初始化的时候, 都会调用一次这个函数, 通过返回值进行设置文本
                   // 参数1: type  取值: page  first  last  prev  next
                   // 参数2: page  指当前这个按钮所指向的页码
                   // 参数3: current 当前页
                   itemTexts:function(  type, page, current ){
                       // console.log(arguments); //arguments:打印所有参数
                       // switch case 主要配置 type值：page  first  last  prev  next
                       switch(type){
                           case "page":
                               // return page;
                               return "第"+ page + "页";
                               // break; //这里break可以省掉 因为 return 了
                           case "first":
                               return "首页";
                           case "last":
                               return "尾页";
                           case "prev":
                               return "上一页";
                           case "next":
                               return "下一页";
                       }
                   },

                   // 配置 title 提示信息
                   tooltipTitles:function( type, page, current ){
                       switch(type){
                           case "page":
                               return "前往第" + page + "页";
                           case "first":
                               return "首页";
                           case "last":
                               return "尾页";
                           case "prev":
                               return "上一页";
                           case "next":
                               return "下一页";
                       }
                   },
                  // 使用bootstrap 提示框组件
                   useBootstrapTooltip:true,

               // 给分页按钮注册点击事件
                   onPageClicked: function(a,b,c,page){
                       currentPage = page;
                       // 页面重新渲染
                       render();
                   }
               })
           }
       })
   }

   // 2.点击 添加商品按钮 显示模态框
    $("#addBtn").click(function(){
      $("#addModal").modal("show");

      // 点击显示模态框同时 发送 ajax 请求 获取所有二级分类数据 进行下拉菜单渲染
      //  通过分页接口，模拟获取全部数据的接口
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function(info){
                console.log(info);
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);
            }
        })
    });

   // 3.给dropdown-menu 下面的 a 注册点击事件（事件委托）
    $(".dropdown-menu").on("click","a",function(){
        // 获取选中的文本
        var txt = $(this).text();
        // 将文本赋值给 隐藏域
        $("#dropdownText").html(txt);

        // 设置 id 给隐藏域,将来用于提交给后台
        var id = $(this).data("id");
        $('[name="brandId"]').val(id);

        // 重置校验状态为 VALID
        $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");
    });

    // 4.文件上传初始化
    $("#fileupload").fileupload({
        // 返回的数据类型
        dataType:"json",
        // 文件上传完成时调用的回调函数
        done: function( e, data ){
            // data.result 是后台响应的内容
            console.log( data.result );

            // 往数组的最前面追加 图片对象
            picArr.unshift( data.result );

            // 往 imgBox 最前面追加 img 元素
            // prepend 数组中的方法 往一个元素最前面追加元素
            // append: 是往最后一个元素后面 追加元素
            $("#imgBox").prepend('<img src="'+ data.result.picAddr +'" width="100">');

            // 通过判断数组长度，如果数组长度大于3 将数组最后一项移除
            if( picArr.length > 3 ) {
                // 移除数组的最后一项
                // pop():数组中的方法 移除数组最后一个元素
                picArr.pop();

                // 还有移除 imgBox 中的最后一张图片
                // $("#imgBox img").eq(-1);  两种方法都可以
                $("#imgBox img:last-of-type").remove();
            }
                // 通过以上处理后，如果图片数组的长度正好为3 ，手动重置：将picStatus的状态重置为VALID
                if( picArr.length === 3 ){
                    $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
                }
            }
    });

    // 5.表单校验初始化
    $("#form").bootstrapValidator({
        // 重置排除项，设置为空 即是 不排除
        //    excluded: 排除，不包括在内
        excluded:[],

        // 配置图标
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',  //校验成功  valid：有效的
                invalid: 'glyphicon glyphicon-remove',   // 校验失败 invalid:无效
                validating: 'glyphicon glyphicon-refresh'  //validating:校验中
            },
            // 配置字段
            fields:{
                // 字段名
                brandId:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请选择二级分类"
                        }
                    }
                },

                proName:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请输入商品名称"
                        }
                    }
                },
                proDesc:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请输入商品描述"
                        }
                    }
                },
                // 商品库存
                num:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请输入商品库存"
                        },
                        //正则校验
                        // \d 表示数字0-9
                        // + 表示出现一次或多次
                        // * 表示出现0次或多次
                        // ？表示出现0次或1次
                        regexp: {
                            regexp: /^[1-9]\d*$/,
                            message: '商品库存必须是非零开头的数字'
                        }
                    }
                },
                // 商品尺码
                //   除了非空，还要求以 xx-xx 的格式 x为数字
                size:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请输入商品尺码"
                        },
                        // 要求以 xx-xx 的格式 x为数字
                        // \d{2} 表示以数字开头 只有2位数字
                        regexp: {
                            regexp: /^\d{2}-\d{2}$/,
                            message: '尺码格式必须是xx-xx的格式，例如35-40'
                        }
                    }
                },
                oldPrice:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请输入商品原价"
                        }
                    }
                },
                price:{
                    // 校验规则
                    validators:{
                        notEmpty:{
                            message:"请输入商品现价"
                        }
                    }
                },
                // 图片校验
                picStatus:{
                    validators:{
                        notEmpty:{
                            message:"请上传3张图片"
                        }
                    }
                }

            }
    });

    // 6.注册表单校验成功事件，阻止默认提交 通过ajax提交
    $("#form").on('success.form.bv', function( e ){
        e.preventDefault();

        // serialize() 获取的是表单元素的数据 图片数据是不能获取的
        var paramsStr = $("#form").serialize();

        // 还需要拼接上图片的name 和 地址
        // username=123&password=234
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        paramsStr += "&picName1="+ picArr[0].picName +"&picAddr2=" + picArr[0].picAddr;
        paramsStr += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
        paramsStr += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;

        console.log(paramsStr);

        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data: paramsStr,
            dataType:"json",
            success:function(info){
                // console.log(info);
                if(info.success){
                    // 添加成功：
                    // 1.关闭模态框
                    $("#addModal").modal("hide");
                    // 2.页面重新渲染 渲染第一页
                    currentPage = 1;
                    render();
                    // 3.重置表单
                    $("#form").data("bootstrapValidator").resetForm(true);
                    // 4.下拉列表 和 图片 不是表单元素 需要手动重置
                    $("#dropdownText").text("请选择二级分类");
                    $("#imgBox img").remove(); //让所有图片自杀
                }
            }
        })
    })

});