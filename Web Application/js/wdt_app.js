$(document).ready(function () {
  let selectedRows = [];
  $.ajax({
    url: "https://randomuser.me/api/?results=5",
    dataType: "json",
    success: function staffUserGet(response) {
      len = response["results"].length;

      let employeeTable = document.querySelector("#employeeTableBody");
      let item;
      response["results"].forEach((item) => {
        employeeTable.innerHTML += `
          <tr>
            <th scope="row"><img src="${item.picture.large}"height=50 width=60></img></th>
            <td>${item.name.first}</td>
            <td>${item.name.last}</td>
            <td>${item.email}</td>
            <td class="text-center status">In</td>
            <td class="text-center currentTime"></td>
            <td class="text-center empOutTime"></td>
            <td class="text-center returnTime"></td>
          </tr>`;
      });

      $("#employeeTableBody tr").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        const value = $(this).find("td:first").html();
      });

      let checkInterval;
      $("#out").on("click", function (e) {
        let outTime = prompt(
          $("#employeeTableBody tr.selected td:first").html()
        );

        //status change
        $("#employeeTableBody tr.selected .status").text("Out");

        //current time in hh:mm
        let currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
        $("#employeeTableBody tr.selected .currentTime").text(currentTime);

        //total time out duration in hh:mm
        function toHoursAndMinutes(totalMinutes) {
          const minutes = totalMinutes % 60;
          const hours = Math.floor(totalMinutes / 60);
          return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
        }
        function padTo2Digits(num) {
          return num.toString().padStart(2, "0");
        }
        let formattedOutTime = toHoursAndMinutes(outTime);
        $("#employeeTableBody tr.selected .empOutTime").text(formattedOutTime);

        // current time + time out = return time
        let newTime = new Date(new Date().getTime() + outTime * 60000);
        let formattedNewTime = `${padTo2Digits(
          newTime.getHours()
        )}:${padTo2Digits(newTime.getMinutes())}`;
        $("#employeeTableBody tr.selected .returnTime").text(formattedNewTime);

        // Check if return time has passed.
        let checkInterval = setInterval(() => {
          if (newTime < new Date()) {
            const toastDiv = document.querySelector("#liveToastBtn");
            toastDiv.innerHTML += `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
              <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true"data-bs-autohide="false">
                <div class="toast-header">
                  <strong class="me-auto">Bootstrap</strong>
                  <small>Left ${formattedOutTime} mins ago</small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">${name} is Late</div>
               </div>
            </div>`;

            const toastEl = document.querySelector("#liveToast");
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
          }
        }, 1000);
        clearInterval(checkInterval);
      });

      // ‘In’ button will clear their Out Time, Duration and Expected Return Time cells,
      $("#in").on("click", function (e) {
        $("#employeeTableBody tr.selected .status").text("In");
        $("#employeeTableBody tr.selected .empOutTime").text("");
        $("#employeeTableBody tr.selected .currentTime").text("");
        $("#employeeTableBody tr.selected .returnTime").text("");
        clearInterval(checkInterval);
      });
    },
  });
});

const toastTrigger = document.getElementById("liveToastBtn");
const toastLiveExample = document.getElementById("liveToast");
if (toastTrigger) {
  toastTrigger.addEventListener("click", () => {
    const toast = new bootstrap.Toast(toastLiveExample);

    toast.show();
  });
}
/*
let toast = document.querySelector("#liveToastBtn");
        toast.innerHTML += `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
              <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <img src="${item.picture.large}" class="rounded me-2">
                  <strong class="me-auto">Bootstrap</strong>
                  <small>Left office ${outTime} mins ago </small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                ${item.name.first} ${item.name.last} is late
                </div>
              </div>
            </div>`;
*/

//                      Schedule Delivery
function selectVehicle(vehicleType) {
  let selectedVehicleInput = document.getElementById("selectedVehicle");
  if (vehicleType === "car") {
    selectedVehicleInput.value = "car";
    document.getElementById("vehicleDropdown").innerHTML =
      '<i class="bi bi-car-front"></i>';
  } else if (vehicleType === "bike") {
    selectedVehicleInput.value = "bike";
    document.getElementById("vehicleDropdown").innerHTML =
      '<i class="bi bi-bicycle"></i>';
  }
}

function saveInput() {
  // get input values by ID
  var vehicle = document.getElementById("selectedVehicle").value;
  var name = document.getElementById("nameInput").value;
  var surname = document.getElementById("surnameInput").value;
  var telephone = document.getElementById("telephoneInput").value;
  var address = document.getElementById("addressInput").value;
  var returnTime = document.getElementById("returnTimeInput").value;

  if (
    name === "" ||
    surname === "" ||
    telephone === "" ||
    address === "" ||
    returnTime === "" ||
    vehicle === ""
  ) {
    alert("Please fill in all input fields");
    return;
  }
  // create object with input values
  var inputObject = {
    vehicle: vehicle,
    name: name,
    surname: surname,
    telephone: telephone,
    address: address,
    returnTime: returnTime,
  };

  // do something with the input object
  addDeliveryToTable(inputObject);
  console.log(inputObject);

  document.getElementById("selectedVehicle").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("surnameInput").value = "";
  document.getElementById("telephoneInput").value = "";
  document.getElementById("addressInput").value = "";
  document.getElementById("returnTimeInput").value = "";
}

function addDeliveryToTable(inputObject) {
  var tableBody = document.getElementById("outputTableBody");
  var newRow = tableBody.insertRow();
  newRow.innerHTML = `
    <th>${
      inputObject.vehicle === "car"
        ? '<i class="bi bi-car-front"></i>'
        : '<i class="bi bi-bicycle"></i>'
    }</th>
    <td>${inputObject.name}</td>
    <td>${inputObject.surname}</td>
    <td>${inputObject.telephone}</td>
    <td>${inputObject.address}</td>
    <td>${inputObject.returnTime}</td>`;
}

function clearDeliveries() {
  var tableBody = document.getElementById("outputTableBody");
  tableBody.innerHTML = "";
  document.getElementById("selectedVehicle").value = "";
  document.getElementById("nameInput").value = "";
  document.getElementById("surnameInput").value = "";
  document.getElementById("telephoneInput").value = "";
  document.getElementById("addressInput").value = "";
  document.getElementById("returnTimeInput").value = "";
}

/*
// digital clock
let date = document.querySelector("#currentTime");
function digitalClock() {
  var today = new Date().toUTCString().slice(5, 25);
  date.innerHTML = today;
}
setInterval(digitalClock, 1000);
*/
