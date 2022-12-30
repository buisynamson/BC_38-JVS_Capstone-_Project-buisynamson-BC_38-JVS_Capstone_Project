var productSer = new SanPhamService();

getListProducts();
supFilterType("typeOption");
function getListProducts() {
  productSer
    .getList()
    .then(function (result) {
      console.log(result.data);
      renderTable(result.data);
      setLocalStorage(result.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function setLocalStorage(mangSP) {
  localStorage.setItem("DSSP", JSON.stringify(mangSP));
}

//Gắn sự kiện click cho button search
document.getElementById("search").addEventListener("click", function () {
  var arrPro = getLocalStorage();
  var searchObj = [];
  console.log(arrPro);

  var chuoiTK = document.getElementById("inputTK").value;

  searchObj = productSer.search(arrPro, chuoiTK);

  console.log(searchObj);
  renderTable(searchObj);
});

function getLocalStorage() {
  var arr = JSON.parse(localStorage.getItem("DSSP"));
  return arr;
}

document.getElementById("btnThemSP").addEventListener("click", function () {
  var footerEle = document.querySelector(".modal-footer");
  footerEle.innerHTML = `
        <button 
        type="button" 
        id="btn-img"
        onclick="addProducts()" 
        class="btn btn-success"
        >Thêm sản phẩm
        </button>
        
        <button
        id="btnDong"
        type="button"
        class="btn btn-danger"
        data-dismiss="modal"
        >
        Đóng
        </button>
    `;
});

function renderTable(mangSP) {
  var content = "";
  var count = 1;
  mangSP.map(function (sp, index) {
    content += `
            <tr>
                <td>${count}</td>
                <td>
                <div class="img_col">
                <img src='${sp.img}'/>
                </div>
                </td>
                <td>${sp.name}</td>
                <td>${sp.price} $</td>          
                <td>${sp.screen}</td> 
                <td>${sp.backCamera}</td> 
                <td>${sp.frontCamera}</td> 
                <td>${sp.desc}</td>
                <td>${sp.type}</td>
                <td>
                    <button 
                    onclick="deleteProduct('${sp.id}')"
                    class="btn btn-danger">
                     <i class="fa fa-trash-o" aria-hidden="true"></i>
                     </button>
                    <button 
                    onclick="viewProduct('${sp.id}')"
                    class="btn btn-info mt-2"> 
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                </td>
            </tr>
        `;
    count++;
  });
  document.getElementById("tblDanhSachSP").innerHTML = content;
}

async function addProducts() {
  //B1: Lấy thông tin(info) từ form
  // data, info
  if (!validateForm()) return;
  var id = document.getElementById("id").value;
  var name = document.getElementById("TenSP").value;
  var price = document.getElementById("GiaSP").value;
  var screen = document.getElementById("manHinh").value;
  var backCamera = document.getElementById("backCamera").value;
  var frontCamera = document.getElementById("frontCamera").value;
  var img = document.getElementById("HinhSP").value;
  var desc = document.getElementById("MoTa").value;
  var type = document.getElementById("loai").value;

  var sp = new SanPham(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  var promise = productSer.add(sp);
  try {
    var res = await promise;
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Thêm thành công!",
      showConfirmButton: false,
      timer: 1500,
    });
    //Load lại danh sách sau khi thêm thành công
    getListProducts();
    //gọi sự kiên click có sẵn của close button
    //Để tắt modal khi thêm thành công
    document.querySelector("#myModal .close").click();
    document.getElementById("form").reset();
  } catch (error) {
    console.log(error);
  }
}

function deleteProduct(id) {
  Swal.fire({
    title: "CHÚ Ý !!!",
    text: "Bạn chắc muốn xoá thông tin của sản phẩm không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
  }).then(async function (result) {
    if (result.isConfirmed) {
      try {
        var res = await productSer.delete(id);
        getListProducts();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Đã xoá thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
}

function viewProduct(id) {
  productSer
    .view(id)
    .then(function (result) {
      console.log(result.data);
      //Mở modal
      $("#myModal").modal("show");
      //Điền thông tin lên form
      document.getElementById("id").value = result.data.id;
      document.getElementById("TenSP").value = result.data.name;
      document.getElementById("GiaSP").value = result.data.price;
      document.getElementById("manHinh").value = result.data.screen;
      document.getElementById("backCamera").value = result.data.backCamera;
      document.getElementById("frontCamera").value = result.data.frontCamera;
      document.getElementById("HinhSP").value = result.data.img;
      document.getElementById("MoTa").value = result.data.desc;
      document.getElementById("loai").value = result.data.type;

      //Thêm button cập nhật cho form
      var footer = document.querySelector(".modal-footer");
      footer.innerHTML = `
            <button onclick="updateProduct('${result.data.id}')" class="btn btn-success">Cập nhật</button>
            <button
            onclick="cancelUpdate()"
            id="btnDongCapNhat"
            type="button"
            class="btn btn-danger"
            data-dismiss="modal"
          >
            Đóng
          </button>
        `;
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function updateProduct(id) {
  //B1: Lấy thông tin(info) từ form
  if (!validateForm()) return;
  var id = document.getElementById("id").value;
  var name = document.getElementById("TenSP").value;
  var price = document.getElementById("GiaSP").value;
  var screen = document.getElementById("manHinh").value;
  var backCamera = document.getElementById("backCamera").value;
  var frontCamera = document.getElementById("frontCamera").value;
  var img = document.getElementById("HinhSP").value;
  var desc = document.getElementById("MoTa").value;
  var type = document.getElementById("loai").value;

  var sp = new SanPham(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  var promise = productSer.update(id, sp);
  try {
    var res = await promise;
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Cập nhật thành công!",
      showConfirmButton: false,
      timer: 1500,
    });
    //Load lại danh sách sau khi cập nhật thành công
    getListProducts();
    //gọi sự kiên click có sẵn của close button
    //Để tắt modal khi cập nhật thành công
    document.querySelector("#myModal .close").click();
    document.getElementById("form").reset();
  } catch (error) {
    console.log(error);
  }
}

function cancelUpdate() {
  document.querySelector("#myModal .close").click();
  document.getElementById("form").reset();
}

function filterProduct() {
  var prdArr = getLocalStorage();
  var res = [];
  var type = document.getElementById("typeOption").value;
  if (type === "0") {
    renderTable(prdArr);
    return;
  }
  for (var i = 0; i < prdArr.length; i++) {
    var productType = prdArr[i].type;
    console.log(productType);
    if (type.toLowerCase() === productType.toLowerCase()) {
      res.push(prdArr[i]);
    }
  }

  renderTable(res);
}


//==============================================//

/**
 *          VALIDATION FORM
 *  - Các dữ liệu bắt buộc phải được nhập
 *
 *  - Name: phải từ 2 - 30 ký tự.
 *  - Giá: số
 *  - Screen: giá trị số + inches
 *  - Back Camera: trong chuỗi phải có Số và MP.
 *  - Front Camera: trong chuỗi phải có Số và MP.
 *  - Img:  Phải nhập link đường dẫn trực tuyến.
 *  - Desc: phải từ 2 - 100 ký tự.
 *  - Type: chọn 1 loại máy
 *
 *
 */

function required(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "* Vui lòng nhập thông tin!";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// check min & max length
function length(val, config) {
  if (val.length < config.min || val.length > config.max) {
    document.getElementById(
      config.errorCode
    ).innerHTML = `*Độ dài phải từ ${config.min} đến ${config.max} ký tự`;
    document.getElementById(config.errorCode).style.display = "block";
    return false;
  }
  document.getElementById(config.errorCode).innerHTML = "";
  return true;
}



// pattern Screen

function patternScreen(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
  "*Dữ liệu nhập không có thông số của màn hình. Ví dụ: 6 inches"
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// pattern camera

function patternCamera(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "*Dữ liệu nhập không có thông số của Camera. Ví dụ: 8 MP";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}


// pattern img

function patternImg(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "*Nhập vào link trực tuyến. Ví dụ: http://...";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// pattern desc

function patternDesc(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }
  document.getElementById(config.errorCode).innerHTML =
    "*Nội dung từ 2-100 ký tự!";
  document.getElementById(config.errorCode).style.display = "block";
  return false;
}

// pattern type
function patternType(config) {
  if (document.getElementById("default").selected === true) {
    document.getElementById(config.errorCode).innerHTML = "*Chọn loại máy!";
    document.getElementById(config.errorCode).style.display = "block";
    return false;
  } else {
    document.getElementById(config.errorCode).style.display = "none";
    return true;
  }


}
function validateForm() {
  //B1: Lấy thông tin(info) từ form
  // var id = getELE("id").value;
  var name = document.getElementById("TenSP").value;
  var price = document.getElementById("GiaSP").value;
  var screen = document.getElementById("manHinh").value;
  var backCamera = document.getElementById("backCamera").value;
  var frontCamera = document.getElementById("frontCamera").value;
  var img = document.getElementById("HinhSP").value;
  var desc = document.getElementById("MoTa").value;


  var nameValid =
  required(name, { errorCode: "tbTenSP" }) &&
  length(name, { errorCode: "tbTenSP" , min: 2, max: 30 });

  var priceValid = required(price, { errorCode: "tbGiaSP" });

  var screenValid = required(screen, { errorCode: "tbmanHinh" }) &&
  patternScreen(screen, {
    errorCode: "tbmanHinh",
    regexp: /[0-9]+ (inches)/g
  });;

  var backCameraValid =
   required(backCamera, { errorCode: "tbBackCamera" })&&
   patternCamera(backCamera, {
    errorCode: "tbBackCamera",
    regexp: /[0-9]+ (MP)+/g
  });

  var frontCameraValid =
  required(frontCamera, { errorCode: "tbFrontCamera" }) &&
  patternCamera(frontCamera, {
    errorCode: "tbFrontCamera",
    regexp: /[0-9]+ (MP)+/g
  });


  var imgValid = 
  required(img, { errorCode: "tbHinhSP" }) &&
  patternImg(img, {
    errorCode: "tbHinhSP",
    regexp: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
  });

  var descValid = 
  required(desc, { errorCode: "tbMota" })&&
  length(name, { errorCode: "tbTenSP" , min: 2, max: 100 });

  var typeValid = patternType({ errorCode: "tbType" });

  var isFormValid =
    nameValid &&
    priceValid &&
    screenValid &&
    backCameraValid &&
    frontCameraValid &&
    imgValid &&
    descValid &&
    typeValid;
  return isFormValid;
}
