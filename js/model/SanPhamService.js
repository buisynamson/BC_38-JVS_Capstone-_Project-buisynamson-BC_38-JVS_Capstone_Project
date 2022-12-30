function SanPhamService() {
    this.getList = function () {
        var promise = axios({
            method: 'get',
            url: 'https://6390231465ff4183110a1697.mockapi.io/Products'
            
        });

        return promise;
    }
    this.add = function (sp) {
        var promise = axios({
            method: 'post',
            url: 'https://6390231465ff4183110a1697.mockapi.io/Products',
            data: sp
        });

        return promise;
    }
    this.delete = function (id) {
        //DELETE: xóa data dựa vào id
        var promise = axios({
            method: 'delete',
            url: `https://6390231465ff4183110a1697.mockapi.io/Products/${id}`
        });

        return promise;
    }
    this.view = function (id) {
        //GET: lấy data cua 1 sản phẩm dựa vào id
        var promise = axios({
            method: 'get',
            url: `https://6390231465ff4183110a1697.mockapi.io/Products/${id}`
        });

        return promise;
    }
    this.update = function (id, sp) {
        //PUT: cập nhật data của 1 sản phẩm dựa vào id
        var promise = axios({
            method: 'put',
            url: `https://6390231465ff4183110a1697.mockapi.io/Products/${id}`,
            data: sp
        });

        return promise;
    }


    this.search = function(mangSP, chuoiTK){

        var searchObj = [];
        searchObj = mangSP.filter(function(sp){
            return sp.name.toLowerCase().indexOf(chuoiTK.toLowerCase()) >= 0;
        });
        return searchObj;
    }


}