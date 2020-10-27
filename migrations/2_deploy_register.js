const Register = artifacts.require("Register");

module.exports = (deployer) => {
    deployer.deploy(Register, "Moncef", "Ess", "Ibn Tofail University of science");
}