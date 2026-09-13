"""Validation harness: score CV/AI output against human-coded ground truth.

The success metric for any CV change is whether it *reduces human correction*,
not whether it looks right. This package scores auto-generated events against a
manual reference and produces a small, comparable report per run.
"""
