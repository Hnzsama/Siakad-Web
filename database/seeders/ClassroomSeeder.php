<?php

namespace Database\Seeders;

use App\Models\ClassLevel;
use App\Models\Major;
use App\Models\Shift;
use App\Models\StudyGroup;
use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassroomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = Teacher::inRandomOrder()->get();
        $teacherIndex = 0;

        $classrooms = [
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::first()->id,
                'study_group_id' => StudyGroup::first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::first()->id,
                'study_group_id' => StudyGroup::skip(1)->take(1)->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::first()->id,
                'study_group_id' => StudyGroup::skip(2)->take(1)->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::skip(1)->take(1)->first()->id,
                'study_group_id' => StudyGroup::first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::skip(1)->take(1)->first()->id,
                'study_group_id' => StudyGroup::skip(1)->take(1)->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::skip(1)->take(1)->first()->id,
                'study_group_id' => StudyGroup::skip(2)->take(1)->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::skip(2)->take(1)->first()->id,
                'study_group_id' => StudyGroup::first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::skip(2)->take(1)->first()->id,
                'study_group_id' => StudyGroup::skip(1)->take(1)->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
            [
                'teacher_id' => $teachers[$teacherIndex++]->id,
                'class_level_id' => ClassLevel::skip(2)->take(1)->first()->id,
                'study_group_id' => StudyGroup::skip(2)->take(1)->first()->id,
                'shift_id' => Shift::inRandomOrder()->first()->id,
                'major_id' => Major::first()->id,
                'room_number' => 'A101',
                'status' => true
            ],
        ];

        foreach ($classrooms as $classroom) {
            \App\Models\Classroom::create($classroom);
        }
    }
}
