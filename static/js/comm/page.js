/**
 * hujinxi
 * 胡金喜
 * 0.1
 */

;(function(window,$){
    'use strict';
    var Page = function(pageSize,options){
    	var _pageNo = 0;
    	var _totals = 0;
    	var _totalPages = 0;
    	var _pageSize = 10;
    	if(!isNaN(pageSize) || pageSize/1>0){
    		_pageSize=pageSize/1;
    	}
    	
    	var page= {
    		$el:null,//渲染的位置
    		refresh:function(){
    			this.query(_pageNo,_pageSize);
    		},
    		firstPage:function(){
    			if(_pageNo==1){
    				return;
    			}
    			this.query(1,_pageSize);
    		},
    		lastPage:function(){
    			if(_pageNo==_totalPages){
    				return;
    			}
    			this.query(_totalPages,_pageSize);
    		},
    		pageTo:function(pageNo){
    			if(_pageNo==pageNo || _totalPages<pageNo || pageNo<1){
    				return;
    			}
    			this.query(pageNo,_pageSize);
    		},
    		prePage:function(){
    			if(_pageNo<2){
    				return;
    			}
    			this.query(_pageNo-1,_pageSize);
    		},
    		nextPage:function(){
    			if(_pageNo>=_totalPages){
    				return;
    			}
    			this.query(_pageNo+1,_pageSize);
    		},
    		initTotals:function(pageNo,totals){
    			totals = totals||0;
    			_pageNo = pageNo;
    			_totals = totals;
    			_totalPages = totals>0?parseInt((totals - 1) / pageSize) + 1:0;
    		},
    		query:function(pageNo,pageSize){
    			
    		},
    		render:function(){
    			this.renderPage(this.initPageModel(_pageNo,_pageSize,_totalPages,_totals));
    		},
    		initPageModel:function(pageNo,pageSize,totalPages,totals){
    			totals = totals||0;
    			totalPages = totalPages||1;
 			   // pre 12 ··· 567 ··· 9 10 next
 				var pageModel ={
 						hasPre:false,
 						hasNext:false,
 						currNo:pageNo,
 						totals:totals,
 						totalPages:totalPages,
 						pageCount:[],
 				}
 				//设置上一页 下一页
 				pageModel.hasPre=true;
 				if(pageNo<totalPages){
 					pageModel.hasNext=true;
 				}
 				//加载1 2
 				for(var i=1 ;i<3;i++){
 					if(i<pageNo-1){
 						pageModel.pageCount.push({
     						isPage:true,
         					pageNo:i
         				});
 					}
 				}
 				//是否加载前置···
 				if(pageNo>4){
 					pageModel.pageCount.push({
 						isPage:true,
     					pageNo:"···"
     				});
 				}
 				//加载 中间 567
 				for(var i=-1 ;i<2;i++){
 					//防止和末尾2位重合 pageNo-1 pageNo pageNo+1
 					if(pageNo+i>0 && pageNo+i<=totalPages){
 						pageModel.pageCount.push({
     						isPage:true,
         					pageNo:pageNo+i
         				});
 					}
 				}
 				//是否加载后置···
 				if(pageNo<totalPages-3){
 					pageModel.pageCount.push({
 						isPage:false,
     					pageNo:"···"
     				});
 				}
 				// 加载 9 10 totalPages totalPages-1 比当前页面+1大才显示
 				for(var i=1 ;i>-1;i--){
 					if(pageNo+1<totalPages-i){
 						pageModel.pageCount.push({
     						isPage:true,
         					pageNo:totalPages-i
         				});
 					}
 				}
 				return pageModel;
    		},
    		renderPage:function(pageModel){
    			var html = '<ul class="pagination">';
    			//上一页
    			if(pageModel.hasPre){
    				html += '<li><a class="prePage" href="javaScript:void(1);" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
    			}else{
    				html += '<li><a href="javaScript:{{if hasPre}}recordPage.prePage(){{else}}void(1){{/if}};" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
    			}
    			for(var key in pageModel.pageCount){
    				var value = pageModel.pageCount[key];
    				if(value.isPage){
    					var className = '';
    					if(pageModel.currNo == value.pageNo){
    						className = 'select';
    					}
    					html += '<li><a class="pageTo '+className+'" href="javaScript:void(1)" pageNo="'+value.pageNo+'" >'+value.pageNo+'</a></li>';
    				}else{
    					html += '<li><a  class="no_allowed" href="javaScript:void(1)">'+value.pageNo+'</a></li>';
    					
    				}
					
    			}
    			// 下一页
    			if(pageModel.hasNext){
    				html += '<li> <a href="javaScript:void(1);" class="nextPage" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
    			}else{
    				html += '<li> <a href="javaScript:void(1);" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
    			}
    			var $el = this.$el;
    			if($el!=null){
    				if(pageModel.totals==0 && pageModel.currNo==1){
    					$el.html('');
    				}else{
    					$el.html(html);
    				}
    				$el.off();
    				$el.on("click",".prePage",function(){
    					page.prePage();
    				});
    				$el.on("click",".nextPage",function(){
    					page.nextPage();
    				});
    				$el.on("click",".pageTo",function(){
    					page.pageTo($(this).attr("pageNo")/1);
    				});
    			}
    		}
    		
        };
    	$.extend(page,options);
    	return page;
    };
    window.Page = Page;
})(window,window.Zepto || window.jQuery);