var vm = new Vue({
	el:'#app',
	data:{
		productList:[],
		checkAllFlag:false,
		totalMoney:0,        //总金额
		delFlag:false,     //是否删除
	},
	filters:{          //内部过滤器
		formatMoney:function(value,type){
			return '￥'+value.toFixed(2)+type		
		}
	},
	mounted:function(){
		this.$nextTick(function(){
			vm.cartView();
		})
	},
	methods:{
		 //获取页面数据
		cartView:function(){       
			var _this=this;
			this.$http.get('data/cartData.json').then((res)=>{
				_this.productList=res.data.result.list;
			})
		},
		//修改单价
		changeMoney:function(item,value){     
			if(value==1){
				item.productQuantity++;      //根据后面的参数来判断增减
			}else{
				item.productQuantity--;
				if(item.productQuantity<1){   //默认最低不小于1
					item.productQuantity=1;
				}
			}
			//计算总价
			this.calcTotalPrice();
		},
		 //单选    注册新的属性  checked  需要表明是哪个Item
		selectedProduct(item){         
			var _this=this;
			var checkedSize=0;
			if(typeof item.checked =='undefined'){ //如果未注册
				//全局注册
				//Vue.set(item,'checked',true);
				//局部注册
				this.$set(item,'checked',true);
			}else{
				item.checked=!item.checked;
			}
			//检测有没有全部选中
			var isAll = this.productList.every((value,index)=>{
				return value.checked===true;
			})//如果全部都选择则返回true,有一个不是则返回false
			//赋值给全局变量来更改全选前面的状态
			this.checkAllFlag=isAll?true:false;
			this.calcTotalPrice();
		},
		//全选与取消全选
		checkAll(flag){
			this.checkAllFlag=flag;//判断是全选还是取消全选
			var _this=this;
			this.productList.forEach(function(item,index){  //遍历全部
				//判断有没有注册checked
				if(typeof item.checked=='undefined'){
					_this.$set(item,'checked',_this.checkAllFlag);
				}else{
					item.checked=_this.checkAllFlag;
				}
			});
			this.calcTotalPrice();  //计算总价
		},
		//计算总价
		calcTotalPrice(){
			var _this=this;
			this.totalMoney=0;   //每次触发一次该函数都需要清零方便下次全部计算
			this.productList.forEach(function(item,index){
				if(item.checked){   //将选择的计算在一起
 					_this.totalMoney+=item.productPrice*item.productQuantity;
				}
			})
		},
		//删除商品
		delProduct:function(index){
			this.productList.splice(index,1);
			this.delFlag=false;
			this.calcTotalPrice();  //计算总价
		}
	}
})
Vue.filter('money',(value,type)=>{
	return '￥'+value.toFixed(2)+''+type;
})