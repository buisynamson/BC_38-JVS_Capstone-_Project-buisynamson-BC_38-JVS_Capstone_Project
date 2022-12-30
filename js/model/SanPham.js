/**
 * Khai báo lớp đối tượng Sản Phẩm 
 * Chứa các thông tin của sản phẩm từ form
 * 
 */

function SanPham(id, name,price, screen, backCamera, frontCamera, img, desc, type){
  //Thuộc tính
  this.id= id;
  this.name = name;
  this.price = price;
  this.screen = screen;
  this.backCamera= backCamera;
  this.frontCamera= frontCamera;
  this.img= img;
  this.desc= desc;
  this.type = type;



}