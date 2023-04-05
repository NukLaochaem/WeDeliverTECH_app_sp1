$(document).ready(function () {
  $.ajax({
    url: "https://randomuser.me/api/?results=5",
    dataType: "json",
    success: function staffUserGet(response) {
      console.log(response);
      len = response["results"].length;

      let empTable = document.querySelector("#empTableBody");
      response["results"].forEach((item) => {
        empTable.innerHTML += `
          <tr>
            <th scope="row"><img src="${item.picture.large}"height=50 width=60></img></th>
            <td>${item.name.first}</td>
            <td>${item.name.last}</td>
            <td>${item.email}</td>
            <td>In</td>
            <td class="empOutTime"></td>
            <td></td>
            <td></td>
          </tr>`;
      });

      $("#empTableBody tr").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var value = $(this).find("td:first").html();
      });

      $("#out").on("click", function (e) {
        let outTime = prompt($("#empTableBody tr.selected td:first").html());
        $("#empTableBody tr.selected .empOutTime").text(outTime);
      });
    },
  });
});

let date = document.querySelector("#currentTime");

function digitalClock() {
  var today = new Date().toUTCString().slice(5, 25);
  date.innerHTML = today;
}
setInterval(digitalClock, 1000);
