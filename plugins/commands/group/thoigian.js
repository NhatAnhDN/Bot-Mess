import { existsSync, createReadStream } from 'fs';

const config = {
    name: "thoigian",
    aliases: [""],
    description: "time",
    usage: "[query]",
    cooldown: 3,
    permissions: [0, 1, 2],
    credits: "",
};
function getCurrentTimeInVietnam() {
  const vietnamTimezoneOffset = 7;
  const currentDate = new Date();
  const utcTime = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
  const vietnamTime = new Date(utcTime + (3600000 * vietnamTimezoneOffset));

  const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const day = daysOfWeek[vietnamTime.getDay()];
  const dateString = `${day} - ${vietnamTime.toLocaleDateString('vi-VN')}`;
  const timeString = vietnamTime.toLocaleTimeString('vi-VN');

  return `${dateString} - ${timeString}`;
}
const thinhMessages = [
 "Gọi chị là đồ ăn\nVì không có chị thì em sẽ gầy",

      "Gọi chị là thời trang yodi\nBởi vì chị lookgood feelgood",

      "Em ví dụ mình như số 4-6\nĐể được ở cùng quanh 5",

      "Gọi chị là Cô Giáo\nBởi vì cứ gặp chị là em muốn Trả Bài",

      "Gọi chị là cái ghế\nVì em yêu chị khỏi phải Bàn",

      "Gọi em là thẩm phán\nVì thấy em là anh muốn chung thân",

      "Một nụ cười bằng 10 thang thuốc bổ\nVì vậy anh muốn cả ngày smile (sờ mai)",

      "Anh cực ghét ngày mùng 1-6\nBởi vì ngày đó là ngày Thiếu Nhi",

      "Em là một hoạ sĩ tồi\nVì em vẽ cầu vồng thì thiếu nắng, vẽ hạnh phúc thì thiếu anh",

      "Muốn một lần đưa Roma sang Luân Đôn\nĐể em thấy được thành ý trong anh",

      "Pascal thì viết phương trình\nCòn anh thì viết chuyện tình hai ta",

      "Cu, CuCl2 và Fe3o4 thì có thể kết tủa\nCòn anh và em thì có thể kết hôn",

      "Nhìn em anh lại nhớ đến Ngô Tất Tố\nBởi vì anh chỉ muốn tắt đèn",

      "Trái tim anh đang dao động điều hoà\nTừ khi em đến bỗng lệch pha",

      "Nhìn em anh thấy yêu động vật\nVì chỉ có em làm anh thích thú",

      "Anh chỉ muốn chúng mình là heo\nĐể được cùng em ăn và ngủ",

      "Anh biết em thích badboy\nAnh đây trai tốt nào đâu có phần\nVì tính anh không vui nhưng mà túi anh không vơi",

       "Gọi em là Nội 1972\nVì khiến anh ngày đêm không ngủ",

      "Gặp em anh chỉ muốn nhìn sang trái\nĐể thấy yêu em là phải",

      "Gọi em là đèn đỏ\nVì thấy em là anh biết điểm dừng",

      "Nắng kia đâu làm anh cháy\nNhưng em cười chắc chắn làm anh say",

      "Gọi em là ngã rẽ\nVì gặp em là anh phải cua",

      "Trông cậu hài quá\nToi cuoi cau duoc khong?",

      "Gọi em là Cách Mạng Tháng 8\n Vì em là Thời cơ ngàn năm có một",

      "Em có thể nhờ anh tất cả\nKể cả nhờ ơ nhơ sắc nhớ",

      "Vì em ngọt ngào\nNên tim anh mới lọt vào",

      "Ngắm hoàng hôn anh quên cả trời tối\nNgắm em cười anh quên cả thanh xuân",

      "Xuân Diệu thì biết làm thơ\nCòn anh chỉ biết ngẩn ngơ nhìn nàng",

      "Nếu em coi tình yêu là giọt nước biển\nAnh sẽ đổ cả đại dương vào tim em",

      "Gặp em anh bỗng nặng đầu\nTrên đầu là tóc, trong đầu là em",

      "Gọi em là sunlight\nVì thấy em là anh muốn chén sạch",

      "Em là khói, anh là thịt heo\nTại vì thịt heo sẽ được hun khói",

      "Anh muốn làm cảnh sát giao thông\nĐể dắt em vào le duong",

      "Tính cả rồi\nNhưng gặp em lại rối cả tình",

      "Gọi anh là Florentino còn em là hoa\nVì anh không thể để hụt mất em",

      "Bầu trời nhiêu mây lại thiếu nắng\nLòng ta trống vắng vì thiếu em",

      "Tặng em 1 quả chanh thần\nCắt ra là sự chân thành",

      "Gọi em là Canada 1867\nVì em đã từng thuộc về Anh",

      "Thời tiết này yêu anh là hợp lý\nEm mà bỏ phí thì là em ngu",

      "Mùa đông gió lạnh từng cơn\nYêu anh thì sẽ thích hơn một mình",

      "Đài báo hôm nay trời trở gió\nEm đi đâu đó nhớ mang theo anh",

      "Em ơi nắng ấm xa dần\nĐông sang gió lạnh anh cần em thôi",

      "Mỗi ngày anh trả cho em một chiếc thơm\nĐó gọi là thuế má",

      "Yêu em như x trong phương trình\nBiết rằng vô nghiệm vẫn yêu em",

      "Nguyễn Du lúc viết Truyện Kiều\nHình như viết thiếu là Kiều thua em",

      "Anh học rất dốt văn\nBởi vì yêu em tới khó tả",

      "Covid thì anh không dính\nNhưng yêu em thì anh dương tính",

      "Gọi em là nam châm\nAnh là từ trường vì lúc nào anh cũng tồn tại quanh em",

      "Nghe nói em có nụ cười toả nắng\nVay em thu cuoi anh xem",

      "Gọi em là Hong Kong 1841\nVì khi đó em thuộc về Anh",

      "Gọi em là cà phê\nVì càng cà càng phê",

      "Em có thể cười một chút không\nVì cà phê anh quên bỏ đường rồi",

      "Thiếu oxi ta không thể thở\nVẻ đẹp của nàng thơ không thể tả",

      "Tách ly dùng để uống trà\nTình ca để hát, em là để yêu.",

      "Anh cho phép em ở mãi trong trái tim anh đấy.",

        "Cái gì đầy trong mắt em đó? Hình như là anh.",

        "Số trời đã định, không phải lòng em, chắc chắn anh sẽ ế.",

        "Nhà em có bán rượu không mà sao nói chuyện với em làm anh cứ chếnh choáng? Chàng trai này thật bá đạo. Một cách thả thính gây ấn tượng mạnh đấy.",

        "Có rất nhiều cách để hạnh phúc. Nhanh nhất chính là nhìn thấy em.",

        "Hãy để một lần cho anh được yêu em.",

        "Hôm nay 14 tháng 3, mà sao chưa ai tặng quà anh nhỉ?.",

        "Trong tim em có chỗ nào cho anh không?.",

        "Vận tốc trái tim nhanh không em nhỉ? Để anh tính quãng đường đi đến trái tim em..",

        "Mây là của trời, em là của anh (tag tên chính chủ vào) Khẳng định chủ quyền rồi nhé. Nếu được tag tên mình vào thì từ nay cấm đi thả thính lung tung nhá.",

        "Ngoài kia đám cưới linh đình. Bao giờ thì đến lượt mình em ơi.",

        "Tay anh đây ấm lắm, em muốn nắm thử không?.",

        "1, 2, 3, 5 em có đánh rơi nhịp nào không?.",

        "Em xinh đẹp ơi, làm con dâu mẹ anh không?.",

        "Cần lắm một em gái mưa!.",

        "Giá có em người yêu để cùng khám phá thế giới.",

        "Mình cũng đẹp trai, sao chả ai để ý?.",

        "Đông về tay anh lạnh lắm, nhưng anh vẫn sẵn lòng sưởi ấm tay em.",

        "Mọi người đều yêu cái đẹp, nên anh yêu em.",

        "Bão to, cây đổ. Sao em chưa đổ anh?.",

        "Bố em có phải là một thợ kim hoàn không? Sao em giống viên kim cương vậy?.",

        "Với thế giới thì em chỉ là một người. Còn với anh, em là cả thế giới.",

        "Bố em có phải là tên trộm không? Sao có thể trộm vì sao và gắn vào mắt em như thế?.",

        "Anh như thế này, đã đủ tiêu chuẩn làm bạn trai em chưa?.",

        "Em có muốn làm Mặt Trời duy nhất của anh không?",

        "Này em ơi, mẹ anh đang gọi con dâu kìa.",

        "Giờ nếu có cô gái nào nguyện bên anh, anh sẽ khiến cô ấy hạnh phúc mãi về sau.",

        "Chỉ cần em yêu anh thôi, còn cả thế giới cứ để anh lo.",

        "Cuộc đời này chắc chắn không như ý anh muốn, vậy em sẽ như ý anh muốn.",

        "Em có thể đưa anh đến tiệm bánh được không? Vì anh cũng muốn có một chiếc bánh Cutie giống như em vậy.",

        "Cho anh hỏi em một chút được không?…. Anh trông em rất là quen….Anh nghĩ là? Mình có biết nhau không?(Chém với gái lạ thì chắc chắn sẽ bảo không rồi)….Thế à. Trông em rất giống người yêu tương lai của anh. ?.",

        "Anh là…. Còn em tên gì? (Em tên Quỳnh Anh) Quỳnh Anh Cái tên là là đẹp nhưng mà về sau anh sẽ không đặt tên con gái mình là Quỳnh Anh vì suốt ngày phải lên bảng.",

        "Anh muốn hỏi em một câu này,…thực ra đấy không phải là một câu hỏi. Anh chỉ muốn nói là… Nếu như mà em là CocaCola thì anh sẽ là Pepsi! (Nghĩa là chúng ta là một cặp đồ uống đẹp đôi).",

        "Chán thả thính rồi, ai cưa đi để anh đổ thử một lần.",

        "Anh cá với em rằng em là tay trộm chuyên nghiệp. Bởi vì anh mới nhìn thấy em ở đây và trong nháy mắt là em đã đánh cắp trái tim của anh rồi.",
    
        "Ngày đó trời mưa lớn lắm, anh gặp được em, em không thấy anh, anh không thấy mưa.",

        "Đố em một con gấu bắc cực nặng bao nhiêu kg? (Thường thì các cô gái sẽ trả lời không) Đáp: Anh cũng không biết nhưng anh biết con gấu bắc cực đủ nặng để phá vỡ tảng băng giữa chúng ta.",

        "Nếu mỗi lần nhớ tới em anh được 500 đồng chắc giờ này anh đã vượt xa Bill Gates.",

        "Em có biết rằng anh nhớ em nhiều lắm không? Anh ăn không ngon nhưng ngủ như điên, anh đi giầy quên đi tất, ăn sáng quên đánh răng, anh dùng xăng vo gạo, anh khờ khạo cũng chỉ vì yêu em đó.",

        "Em ơi! Em là nghề gì đấy….? Sao đêm nào em cũng hiện lên trong giấc mơ của anh vậy? Anh chẳng biết làm thế nào nữa cả. Làm người yêu anh em nhé!.",

        "Em ơi ! Khi em đọc tin nhắn này, em nợ anh cuộc hẹn. Xóa tin nhắn này, em nợ anh cuộc tình. Lưu tin là em nợ anh 1 nụ hôn. Trả lời anh, em nợ anh tất cả. Còn nếu em không trả lời thì em đã yêu anh !!! hihi.",

        "Ðiều duy nhất đôi mắt em chưa nói cho anh biết là tên của em.",
                  
        "Anh thà được một lần ngửi được mùi tóc thơm của em. Anh thà được mộ lần xiết chặt bàn tay của em, anh thà được một lần nếm hương vị ngọt từ nụ hôn của em còn hơn là sống bất tử mà không được điều ấy.",
                  
        "Chứng nghiện thức đêm cùng nỗi nhớ em, anh đã cố nhưng sửa không được.",
                  
        "Anh muốn gửi tin nhắn này đến em hôm nay vì hôm nay anh cảm thấy yêu em nhiều đến bất thường."];

async function onCall({ message }) {
  try {
    const currentTimeInVietnam = getCurrentTimeInVietnam();
    const randomIndex = Math.floor(Math.random() * thinhMessages.length);
const thinhMessage = thinhMessages[randomIndex];
  return global.api.sendMessage({ body: `🎀───── •🌸• ─────🎀\n👋 𝗛𝗲𝗹𝗹𝗼, YOU\nㅤ𝗖𝗵𝘂́𝗰 𝗯𝗮̣𝗻 𝟭 𝗻𝗴𝗮̀𝘆 𝘁𝗼̂́𝘁 𝗹𝗮̀𝗻𝗵\nㅤ𝗕𝗮̂𝘆 𝗴𝗶𝗼̛̀ 𝗹𝗮̀: ${currentTimeInVietnam}\nㅤ💟 ${thinhMessage}\n🎀───── •🌸• ─────🎀`}, message.threadID, message.messageID);
    console.log(replyMessage);
  } catch (error) {
    console.error("Error while replying:", error);
  }
}
export default {
    config,
    onCall
};