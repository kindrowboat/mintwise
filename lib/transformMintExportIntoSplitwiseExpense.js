//@flow

/*:: import { MintTransaction } from './MintRepository' */
/*::
  export type SplitwiseExpense = {
    users: {
      user_id: number,
      owed_share: number,
      paid_share?: number
    }[],
    cost: number,
    description: string,
    details: string,
    date: string,
    group_id: string,
    creation_method: 'split',
    payment: false,
    category_id: number,
    currency_code: string,
  }
*/

/*::
  type ExpenseOptions = {
    payerId: number,
    borrowerId: number,
    groupId: string,
    categoryId: number,
    myShare: number,
    log: function
  }
*/

function transformMintExportIntoSplitwiseExpense(transaction /*:MintTransaction*/, options /*:ExpenseOptions*/) /*:SplitwiseExpense*/ {
  const {payerId, borrowerId, groupId, categoryId, log} = options;
  if (transaction.isCredit) {
    console.error(transaction);
    throw 'This script does not currently handle credit transactions.';
  }

  const amount = Number(transaction.amount);
  const myShare = amount * options.myShare;
  const myShareRounded = Number(myShare.toFixed(2));
  const othersShare = Number((amount - myShareRounded).toFixed(2));
  const expense = {
    users: [
      {user_id: borrowerId, owed_share: othersShare},
      {user_id: payerId, paid_share: amount, owed_share: myShareRounded}
    ],
    cost: amount,
    description: transaction.description,
    details: transaction.notes,
    date: new Date(transaction.date).toISOString(),
    group_id: groupId,
    creation_method: 'split',
    payment: false,
    category_id: categoryId,
    currency_code: transaction.currency,
  };
  log('=========TRANSFORMED========');
  log(transaction);
  log('-------------to-------------');
  log(expense);
  return expense;
}

module.exports = transformMintExportIntoSplitwiseExpense;
