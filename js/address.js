var vm = new Vue({
	el:'.container',
	data:{
		addressList:[],         //地址列表
		limitNum:3,                   //限制显示个数
		currentIndex:0,
		delFlag:false,         //删除地址
		shippingMethod:1       //设置列表
	},
	filter:{

	},
	mounted:function(){
		this.$nextTick(function(){
			vm.getAddressList();
		})
	},
	//地址列表的过滤：
	computed:{
		filterAddress:function(){
			return this.addressList.slice(0,this.limitNum);
		}
	},
	methods:{
		getAddressList(){
			var _this=this;
			this.$http.get('data/address.json').then(function(response){
				var res = response.data;
				if(res.status=='0'){
					_this.addressList=res.result;
				}
			})
		},
		//显示更多
		loadMore(){
			if(this.limitNum==this.addressList.length){
				this.limitNum=3;
			}else{
				this.limitNum=this.addressList.length
			}
		},
		setDefault(addressId){ //需要知道设为哪个为默认
			this.addressList.forEach((item,index)=>{
				if(item.addressId==addressId){
					item.isDefault=true;
				}else{
					item.isDefault=false;
				}
			})
		},
		//删除地址
		delAddress(index){
			this.addressList.splice(index,1);
			this.delFlag=false;
		}
	}
})