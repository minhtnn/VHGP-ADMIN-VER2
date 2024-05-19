import React, { useState } from "react";

const CurrencyInput = ({ label, value, onChange }) => {
  // Hàm xử lý sự kiện khi thay đổi giá trị
  const handleChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, ""); // Loại bỏ mọi ký tự không phải là số
    newValue = newValue === "" ? "0" : newValue; // Nếu không có giá trị, gán giá trị là "0"
    onChange(newValue); // Gọi hàm xử lý sự kiện của parent component và truyền giá trị đã xử lý
  };

  // Hàm định dạng số thành chuỗi với chữ "đ" và theo định dạng hàng nghìn
  const formatNumber = (number) => {
    const formattedNumber = parseFloat(number)
      .toFixed(0)
      .replace(/\d(?=(\d{3})+$)/g, "$&,");
    return formattedNumber;
  };

  return (
    <div className="form-group">
      <label className="form-control-label">
        {label} <span style={{ color: "red" }}>*</span>
      </label>
      <input
        min={0}
        className="form-control"
        type="number"
        value={formatNumber(value) + "đ"} // Định dạng giá trị và thêm chữ "đ" vào cuối
        onChange={handleChange} // Gọi hàm xử lý sự kiện khi thay đổi giá trị
      />
      <div className="invalid-feedback">{`${label} không được để trống`}</div>
    </div>
  );
};

export default CurrencyInput;
