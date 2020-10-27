const Register = artifacts.require("Register");
const Web3 = require('web3');
const _web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

contract("Register", (accounts) => {
    var registerInstance;
    const dean = accounts[0];
    const student = accounts[1];
    const data_student = {
        address: student,
        first_name: "anass",
        last_name: "azzour",
        birthday: 877983344
    }
    const data_diploma = {
        title: 'M.sc Software Engineering for Cloud Computing',
        mention: 'pretty good',
        student: student,
        dean: dean
    }
    it("Initialization of Register contract", ()=> {
        return Register.deployed().then((instance)=>{
            registerInstance = instance;
            return registerInstance.address;
        }).then((address) => {
            assert.notEqual(address, '0x0');
            return registerInstance.getDean();
        }).then((receipt) => {
            assert.equal(receipt.first_name, "Moncef");
            assert.equal(receipt.last_name, "Ess");
            assert.equal(receipt.faculty, "Ibn Tofail University of science");
        })
    })

    it("Add & Get student", ()=> {
        return Register.deployed().then((instance)=>{
            registerInstance = instance;
            return registerInstance.addStudent(student, data_student.first_name, data_student.last_name, data_student.birthday, {from: dean});
        }).then((receipt) => {
            return registerInstance.getStudent.call(student, {from: dean});
        }).then((receipt) =>{
            assert.equal(receipt.first_name, data_student.first_name);
            assert.equal(receipt.last_name, data_student.last_name)
            assert.equal(receipt.birthday, data_student.birthday);
            assert.equal(receipt.number_of_diploma, 0);
            assert.equal(receipt._default, true);
        })
    })

    it('Invalid address of student', ()=> {
        return Register.deployed().then((instance)=>{
            registerInstance = instance;
            return registerInstance.addStudent(student, data_student.first_name, data_student.last_name, data_student.birthday, {from: dean});
        }).then((receipt) => {
            return registerInstance.getStudent.call('0x0', {from: dean});
        }).then(assert.fail).catch((err) => {
            assert.equal(err.reason, 'invalid address');
            return registerInstance.getStudent.call(accounts[2], {from: dean});
        }).then((receipt) => {
            assert.equal(receipt.first_name, '');
            assert.equal(receipt.last_name, '')
            assert.equal(receipt.birthday, 0);
            assert.equal(receipt.number_of_diploma, 0);
            assert.equal(receipt._default, false);
        })
    })

    it('Create a new diploma', async ()=> {
        registerInstance = await Register.deployed();
        const sringfy = JSON.stringify(data_student);
        const sign = await _web3.eth.sign(sringfy, dean);
        var diploma_address ;
        try {
            const dip = await registerInstance.registerDiploma(data_diploma.title, data_diploma.mention, data_diploma.student, sign);
            assert.equal(dip.logs.length, 1);
            assert.equal(dip.logs[0].event, 'Graduate');
            assert.equal(dip.logs[0].args._student, student);
            assert.notEqual(dip.logs[0].args._diploma, '0x0');
            diploma_address = dip.logs[0].args._diploma;
        } catch (error) {
            assert.fail(error);
        }

        try {
            const signedDiploma = await registerInstance.getDiplomaOfStudent.call(student, diploma_address);
            assert.equal(signedDiploma._signed.diploma, diploma_address);
            assert.equal(signedDiploma._signed.signature, sign);
            assert.equal(signedDiploma._student.first_name, data_student.first_name);
            assert.equal(signedDiploma._student.last_name, data_student.last_name);
            assert.equal(signedDiploma._student.birthday, data_student.birthday);
            assert.equal(signedDiploma._student.number_of_diploma, 1);
            assert.equal(signedDiploma._student._default, true);
            assert.equal(signedDiploma._title, data_diploma.title);
            assert.equal(signedDiploma._mention, data_diploma.mention);
            assert.notEqual(signedDiploma._date_creation, 0);
        } catch (error) {
            assert.fail(error);
        }

    })
})