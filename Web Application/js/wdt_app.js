class Employee {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }

  fullName() {
    return `${this.name} ${this.surname}`;
  }
}
class StaffMember extends Employee {
  constructor(
    name,
    surname,
    picture,
    email,
    status,
    outTime,
    duration,
    expectedReturnTime
  ) {
    super(name, surname);
    this.picture = picture;
    this.email = email;
    this.status = status;
    this.outTime = outTime;
    this.duration = duration;
    this.expectedReturnTime = expectedReturnTime;
  }
  staffMemberIsLate() {
    return;
  }
}

class DeliveryDriver extends Employee {
  constructor(name, surname, vehicle, telephone, deliverAddress, returnTime) {
    super(name, surname);
    this.vehicle = vehicle;
    this.telephone = telephone;
    this.deliverAddress = deliverAddress;
    this.returnTime = returnTime;
  }
  deliveryDriverIsLate() {
    return;
  }
}
//                    Staff dashboard
$(document).ready(function () {
  let selectedRow;
  let checkIntervals = {};

  $.ajax({
    url: "https://randomuser.me/api/?results=5",
    dataType: "json",
    success: function staffUserGet(response) {
      len = response["results"].length;
      let employeeTable = document.querySelector("#employeeTableBody");

      response["results"].forEach((item) => {
        const staffMember = new StaffMember(
          item.name.first,
          item.name.last,
          item.picture.large,
          item.email,
          "In",
          "",
          "",
          ""
        );
        employeeTable.innerHTML += `
          <tr>
            <th scope="row"><img src="${staffMember.picture}"height=50 width=60></img></th>
            <td>${staffMember.name}</td>
            <td>${staffMember.surname}</td>
            <td>${staffMember.email}</td>
            <td class="text-center status">${staffMember.status}</td>
            <td class="text-center currentTime"></td>
            <td class="text-center outTime"></td>
            <td class="text-center returnTime"></td>
          </tr>`;
      });

      $("#employeeTableBody tr").click(function () {
        selectedRow = $(this);
        selectedRow.addClass("selected").siblings().removeClass("selected");
      });

      //Out function
      $("#out").on("click", function staffOut(e) {
        let selectedRow = $("#employeeTableBody tr.selected");

        if (selectedRow.length === 0) {
          alert("Please select a staff to clock out.");
          return;
        }
        if (
          !confirm(
            `Are you sure you want to clock out ${selectedRow
              .find("td:nth-child(2)")
              .html()}?`
          )
        ) {
          return;
        }
        let duration = prompt(`Enter duration of time out in minutes:`);
        if (!duration) {
          return;
        }

        selectedRow.find(".status").text("Out");

        let staffCurrentTime = `${String(new Date().getHours()).padStart(
          2,
          "0"
        )}:${String(new Date().getMinutes()).padStart(2, "0")}`;

        $("#employeeTableBody tr.selected .currentTime").text(staffCurrentTime);

        function toHoursAndMinutes(totalMinutes) {
          const minutes = totalMinutes % 60;
          const hours = Math.floor(totalMinutes / 60);
          return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
        }
        function padTo2Digits(num) {
          return num.toString().padStart(2, "0");
        }
        let currentTimeOut = toHoursAndMinutes(duration);
        $("#employeeTableBody tr.selected .outTime").text(currentTimeOut);

        // current time + time out = return time
        let newTime = new Date(new Date().getTime() + duration * 60000);
        let returnTime = `${padTo2Digits(newTime.getHours())}:${padTo2Digits(
          newTime.getMinutes()
        )}`;
        $("#employeeTableBody tr.selected .returnTime").text(returnTime);

        //Late staff
        let staffName = selectedRow.find("td:nth-child(2)").html();
        let staffSurname = selectedRow.find("td:nth-child(3)").html();
        let staffPicture = selectedRow.find("img").attr("src");

        checkIntervals[staffName] = setInterval(function staffMemberIsLate() {
          if (newTime < new Date()) {
            const staffToastContainer =
              document.querySelector(".toast-container");
            const StaffToast = `
              <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                  <img src="${staffPicture}" height="30" width="30" class="rounded me-2">
                  <strong class="me-auto">${staffName} is Late</strong>
                  <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                  ${staffName} ${staffSurname} has been out for ${currentTimeOut}.
                </div>
              </div>`;
            staffToastContainer.innerHTML += StaffToast;

            const toastElement =
              staffToastContainer.querySelector(".toast:last-child");
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
            clearInterval(checkIntervals[staffName]);
          }
        }, 1000);
      });

      // In button  clear Out Time, duration and expected Return Time cells,
      $("#in").on("click", function staffIn(e) {
        if (!selectedRow) {
          alert("Please select a staff member first.");
          return;
        }
        const staffName = selectedRow.find("td:nth-child(2)").html();
        clearInterval(checkIntervals[staffName]);

        selectedRow.find(".status").text("In");
        selectedRow.find(".outTime").text("");
        selectedRow.find(".currentTime").text("");
        selectedRow.find(".returnTime").text("");
      });
    },
  });
});

//                           Schedule Delivery
function selectVehicle(vehicleType) {
  let selectedVehicleInput = document.querySelector("#selectedVehicle");
  if (vehicleType === "car") {
    selectedVehicleInput.value = "car";
    document.querySelector("#vehicleDropdown").innerHTML =
      '<i class="bi bi-car-front"></i>';
  } else if (vehicleType === "bike") {
    selectedVehicleInput.value = "bike";
    document.querySelector("#vehicleDropdown").innerHTML =
      '<i class="bi bi-bicycle"></i>';
  }
}

let drivers = [];

function addDelivery() {
  let vehicle = document.querySelector("#selectedVehicle").value;
  let name = document.querySelector("#nameInput").value;
  let surname = document.querySelector("#surnameInput").value;
  let telephone = document.querySelector("#telephoneInput").value;
  let address = document.querySelector("#addressInput").value;
  let returnTimeInput = document.querySelector("#returnTimeInput").value;

  let hours = returnTimeInput.substring(0, 2);
  let minutes = returnTimeInput.substring(2);
  let returnTime = hours + ":" + minutes;

  if (!validateDelivery(vehicle, name, surname, telephone, returnTime)) {
    return;
  }
  const driver = new DeliveryDriver(
    name,
    surname,
    vehicle,
    telephone,
    address,
    returnTime
  );
  console.log(typeof driver);
  drivers.push(driver);

  driver.intervalId = setInterval(function deliveryDriverIsLate() {
    const currentTime = new Date();
    const estimatedReturnTime = new Date();
    const returnTimeArray = driver.returnTime.split(":");
    estimatedReturnTime.setHours(returnTimeArray[0], returnTimeArray[1]);

    if (estimatedReturnTime < currentTime) {
      const driverToastContainer = document.querySelector(".toast-container");
      const driverToast = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto">${driver.name} is Late</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            ${driver.name} ${driver.surname} (${driver.telephone}) is returning late from ${driver.address}. Estimated return time was ${driver.returnTime}.
          </div>
        </div>`;
      driverToastContainer.innerHTML += driverToast;

      const toastElement =
        driverToastContainer.querySelector(".toast:last-child");
      const toast = new bootstrap.Toast(toastElement);
      toast.show();

      clearInterval(driver.intervalId);
    }
  }, 1000);
  addDeliveryToTable(driver);

  document.querySelector("#selectedVehicle").value = "";
  document.querySelector("#nameInput").value = "";
  document.querySelector("#surnameInput").value = "";
  document.querySelector("#telephoneInput").value = "";
  document.querySelector("#addressInput").value = "";
  document.querySelector("#returnTimeInput").value = "";
}

// Input check
function validateDelivery(vehicle, name, surname, telephone, returnTime) {
  if (vehicle !== "car" && vehicle !== "bike") {
    alert("Please select a vehicle");
    return false;
  }
  if (!/^[a-zA-Z]+$/.test(name)) {
    alert("Name should only contain letters.");
    return false;
  }
  if (!/^[a-zA-Z]+$/.test(surname)) {
    alert("Surname should only contain letters.");
    return false;
  }
  if (!/^\d+$/.test(telephone)) {
    alert("Telephone should only contain numbers.");
    return false;
  }
  if (!/^\d{4}$|^\d{1,2}:\d{2}$/.test(returnTime)) {
    alert("Return time should be either 4 digits or in the format hh:mm.");
    return false;
  }
  return true;
}
//    Take input display on table
let selectedRow = null;

function addDeliveryToTable(driver) {
  let tableBody = document.querySelector("#outputTableBody");
  let newRow = tableBody.insertRow();
  newRow.innerHTML = `
    <td>${
      driver.vehicle === "car"
        ? '<i class="bi bi-car-front"></i>'
        : '<i class="bi bi-bicycle"></i>'
    }</td>
    <td>${driver.name}</td>
    <td>${driver.surname}</td>
    <td>${driver.telephone}</td>
    <td>${driver.deliverAddress}</td>
    <td>${driver.returnTime}</td>`;

  newRow.addEventListener("click", function () {
    if (selectedRow === newRow) {
      selectedRow.classList.remove("driverSelected");
      selectedRow = null;
    } else {
      if (selectedRow) {
        selectedRow.classList.remove("driverSelected");
      }
      selectedRow = newRow;
      selectedRow.classList.add("driverSelected");
    }
  });
}

function clearDeliveries() {
  if (!selectedRow) {
    alert("Please select a driver first.");
    return;
  }
  const confirmed = confirm("Are you sure you want to clear this delivery?");
  if (!confirmed) {
    return;
  }
  let selectedDriver = drivers.find((driver) => {
    return (
      driver.name === selectedRow.cells[1].textContent &&
      driver.surname === selectedRow.cells[2].textContent
    );
  });

  clearInterval(selectedDriver.intervalId);
  selectedRow.remove();
  drivers = drivers.filter((driver) => driver !== selectedDriver);
  selectedRow = null;
}

let date = document.querySelector("#currentTime");
function digitalClock() {
  var now = new Date();
  var options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  date.innerHTML = now.toLocaleString(undefined, options);
}
setInterval(digitalClock, 1000);
