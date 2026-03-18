import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = async (order, user) => {
  try {
    const invoicePath = `./uploads/APNACART_${order._id}.pdf`;

    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(invoicePath);

    doc.pipe(stream);
// ================= WATERMARK =================
doc.save();

// Current  position 
const currentY = doc.y;

doc
  .font("Helvetica-Bold")
  .fontSize(80)
  .fillColor("gray")
  .opacity(0.1)
  .rotate(-45, { origin: [300, 400] })
  .text("APNACART", 100, 300, {
    align: "center",
  });

// Restore everything
doc.restore();

// Y position wapas set karo
doc.y = currentY;

doc.fillColor("black");
doc.opacity(1);


    // ================= HEADER =================
    doc.fontSize(22).text("APNACART", { align: "center" });
    doc.moveDown();

     doc.fillColor("black").fontSize(14).text("ORDER PRODUCT", {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    doc.fontSize(12);
    doc.text(`ORDER ID : ${order._id}`);
    doc.text(`CUSTOMER NAME : ${order.shippingAddress.fullName}`);
    doc.text(`CUSTOMER PHONE NUMBER : ${order.shippingAddress.mobile}`)
    doc.text(`CUSTOMER EMAIL : ${user.email}`);
    doc.text(`PAYMENT METHOD : ${order.paymentMethod}`);
    doc.text(`ORDER DATE : ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    //  PRODUCT TABLE HEADER
    doc.text("============================================================")
    doc.fontSize(14).text("ORDER DETAILS");
    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text("------------------------------------------------------------");

    let subtotal = 0;

    order.items.forEach((item, index) => {
      subtotal += item.totalItemPrice;

      doc.text(
        `${index + 1}. ${item.title}`
      );
      doc.text(`   Quantity : ${item.quantity}`);
      doc.text(`   Price    : ${item.price}`);
      doc.text("------------------------------------------------------------")
      doc.text(`   Total    : ${item.totalItemPrice}`);
      doc.text("------------------------------------------------------------");
    });

    doc.moveDown();

    //  DELIVERY LOGIC 
    let deliveryCharge = 0;

    if (subtotal < 3000) {
      deliveryCharge = 50;
    }

    const finalAmount = subtotal + deliveryCharge;

    const deliveryText =
      deliveryCharge === 0 ? "Free" : `${deliveryCharge}`;

    //  PRICE SUMMARY 
    doc.fontSize(12);
    doc.text(`SUBTOTAL : ${subtotal}`);
    doc.text(`DELIVERY CHARGE : ${deliveryText}`);

    doc.moveDown();
    doc.fontSize(16).text(`FINAL AMOUNT : ${finalAmount}`, {
      underline: true,
    });

    // DELIVERY INFO 
    doc.moveDown(2);
    doc.fontSize(12).text("Delivery Time: 5-7 Working Days");
    // doc.text("Delivery Boy Contact: 9792793008");
    // doc.text("Delivery Boy Name: Taufik Alam");

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(invoicePath));
      stream.on("error", (err) => reject(err));
    });

  } catch (error) {
    console.error("PDF GENERATION ERROR:", error);
    throw new Error("Failed to generate invoice PDF");
  }
};



export const generateCancel = async (order, user) => {
  try {
    const invoicePath = `./uploads/CANCELLED_${order._id}.pdf`;

    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(invoicePath);

    doc.pipe(stream);
    // ================= WATERMARK =================
doc.save();

// Current Y position store karo
const currentY = doc.y;

doc
  .font("Helvetica-Bold")
  .fontSize(80)
  .fillColor("gray")
  .opacity(0.1)
  .rotate(-45, { origin: [300, 400] })
  .text("APNACART", 100, 300, {
    align: "center",
  });

// Restore everything
doc.restore();

// Y position wapas set karo
doc.y = currentY;

doc.fillColor("black");
doc.opacity(1);

    // HEADER
    doc.fontSize(22).fillColor("red").text("APNACART", { align: "center" });
    doc.moveDown();

    doc.fillColor("black").fontSize(14).text("CANCELLED PRODUCT", {
      align: "center",
      underline: true,
    });

    doc.moveDown();

    doc.fontSize(12);
    doc.text(`ORDER ID : ${order._id}`);
    doc.text(`CUSTOMER NAME : ${order.shippingAddress.fullName}`);
    doc.text(`CUSTOMER PHONE : ${order.shippingAddress.mobile}`);
    doc.text(`CUSTOMER EMAIL : ${user.email}`);
    doc.text(`CANCEL DATE : ${new Date().toLocaleDateString()}`);
    doc.text(`REASON : ${order.cancelReason}`);
    doc.moveDown();

    doc.text("====================================================");

    let subtotal = 0;

    order.items.forEach((item, index) => {
      subtotal += item.totalItemPrice;

      doc.text(`${index + 1}. ${item.title}`);
      doc.text(`   Quantity : ${item.quantity}`);
      doc.text(`   Price    : ${item.price}`);
      doc.text(`   Total    : ${item.totalItemPrice}`);
      doc.text("----------------------------------------------------");
    });

    doc.moveDown();
    doc.fontSize(14).text(`TOTAL CANCELLED AMOUNT : ${subtotal}`, {
      underline: true,
    });

    doc.moveDown(2);
    doc.fontSize(12).fillColor("red").text("Your order has been cancelled !.");

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(invoicePath));
      stream.on("error", reject);
    });

  } catch (error) {
    console.error("Cancel PDF Error:", error);
    throw new Error("Failed to generate cancel invoice");
  }
};


//DELIVERY PRODUCT PDF
export const DeliveryProductpdf = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const invoicePath = `./uploads/DELIVERY_${order._id}.pdf`;

      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }

      const doc = new PDFDocument({ margin: 40 });
      const stream = fs.createWriteStream(invoicePath);

      doc.pipe(stream);

      // Watermark
      doc.save().font("Helvetica-Bold").fontSize(80).fillColor("gray").opacity(0.1)
         .rotate(-45, { origin: [300, 400] }).text("APNACART", 100, 300, { align: "center" }).restore();

      // Header
      doc.fillColor("black").opacity(1).fontSize(22).text("APNACART", { align: "center" });
      doc.moveDown().fontSize(14).text("DELIVERY RECEIPT", { align: "center", underline: true }).moveDown();

      // Info
      doc.fontSize(12);
      doc.text(`ORDER ID : ${order._id}`);
      doc.text(`CUSTOMER : ${order.shippingAddress?.fullName || 'N/A'}`);
      doc.text(`PHONE : ${order.shippingAddress?.mobile || 'N/A'}`);
      doc.text(`EMAIL : ${user.email}`);
      doc.text(`DATE : ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      doc.text("------------------------------------------------------------");
      let subtotal = 0;
      order.items.forEach((item, index) => {
        subtotal += item.totalItemPrice;
        doc.text(`${index + 1}. ${item.title} (Qty: ${item.quantity}) - Price: ${item.price}`);
      });
      doc.text("------------------------------------------------------------");

      doc.moveDown().fontSize(14).text(`FINAL AMOUNT : ${order.totalAmount}`, { bold: true });
      doc.moveDown(2).fillColor("green").fontSize(18).text("Status: Delivered Successfully", { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(invoicePath));
      stream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};