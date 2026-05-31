#!/usr/bin/env python3
"""Compatibility wrapper for the sharded BSData core dataset sync."""

from __future__ import annotations

import runpy
from pathlib import Path


if __name__ == "__main__":
    runpy.run_path(
        str(Path(__file__).with_name("sync-bsdata-core-datasets.py")),
        run_name="__main__",
    )
