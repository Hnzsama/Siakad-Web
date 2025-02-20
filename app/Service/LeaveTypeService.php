<?php

namespace App\Service;

use App\Models\LeaveType;

class LeaveTypeService
{
    public function getAllLeaveType()
    {
        return LeaveType::all();
    }
}
