import unittest
from decimal import Decimal

from backend.apps.billing.utils import (
    concat_card_number, get_commission_sum_from_application,
    add_amount_to_current_value, write_off_debt, convert_number_to_decimal
)
from backend.core.config import settings


class TestBillings(unittest.TestCase):

    commission = settings.DEFAULT_COMMISSION_IN_RUBLS

    tests_sums = [20, 50, 1, 1000, 50.1, 33.3, Decimal(1000), Decimal("555.555")]
    current_debts = [50000, 10500.10, Decimal(15555), Decimal("12345.1234")]

    def test_add_amount_to_debt(self):
        for debt in self.current_debts:
            new_debt = add_amount_to_current_value(debt, self.commission)
            self.assertIsInstance(new_debt, Decimal)
            correct_debt_amount = convert_number_to_decimal(Decimal(debt) + self.commission)
            self.assertEqual(correct_debt_amount, new_debt)

    def test_write_off_debt(self):
        for debt in self.current_debts:
            for write_off_sum in self.tests_sums:
                balance = write_off_debt(debt, write_off_sum)
                self.assertIsInstance(balance, Decimal)
                correct_balance = convert_number_to_decimal(Decimal(debt) - Decimal(write_off_sum))
                self.assertEqual(balance, correct_balance)

    def test_concat_card(self):
        card_number = concat_card_number("111111", "4444")
        self.assertIsInstance(card_number, str)
        self.assertEqual(card_number, "111111******4444")

        self.assertRaises(AssertionError, concat_card_number, "11111", "444")
