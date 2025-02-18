import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from "@ton/core";

export type MainContractConfig = {
  number: number;
  address: Address;
  ownerAddress: Address;
};

export const MainContractConfigToCell = (config: MainContractConfig): Cell => {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.ownerAddress)
    .endCell();
};

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: {
      code: Cell;
      data: Cell;
    }
  ) {}

  static createFromConfig = (
    config: MainContractConfig,
    code: Cell,
    workchain = 0
  ) => {
    const data = MainContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new MainContract(address, init);
  };

  sendDeploy = async (
    provider: ContractProvider,
    via: Sender,
    value: bigint
  ) => {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(2, 32).endCell(),
    });
  };

  sendIncreament = async (
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    increment_by: number
  ) => {
    const msg_body = beginCell()
      .storeUint(1, 32) // OP Code
      .storeUint(increment_by, 32)
      .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  };

  sendDeposit = async (
    provider: ContractProvider,
    sender: Sender,
    value: bigint
  ) => {
    const msg_body = beginCell()
      .storeUint(2, 32) //op code
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  };

  sendNoCodeDeposit = async (
    provider: ContractProvider,
    sender: Sender,
    value: bigint
  ) => {
    const msg_body = beginCell()
      // .storeUint(2, 32) //op code
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  };

  sendWithdrawalRequest = async (
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    amount: bigint
  ) => {
    const msg_body = beginCell()
      .storeUint(3, 32) // op code
      .storeCoins(amount)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  };

  getData = async (provider: ContractProvider) => {
    const { stack } = await provider.get("get_contract_storage_data", []);

    return {
      number: stack.readNumber(),
      recent_sender: stack.readAddress(),
      owner_address: stack.readAddress(),
    };
  };

  getBalance = async (provider: ContractProvider) => {
    const { stack } = await provider.get("balance", []);
    return { balance: stack.readNumber() };
  };
}
