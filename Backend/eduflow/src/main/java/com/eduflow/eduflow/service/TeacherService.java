package com.eduflow.eduflow.service;

import com.eduflow.eduflow.dto.TeacherDTO;
import com.eduflow.eduflow.model.Teacher;
import com.eduflow.eduflow.model.User;
import com.eduflow.eduflow.repository.TeacherRepository;
import com.eduflow.eduflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ ADD
    public Teacher addTeacher(TeacherDTO dto) {

        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);

        if (user == null) {
            user = new User();
            user.setName(dto.getName());
            user.setEmail(dto.getEmail());
            user.setPassword(passwordEncoder.encode("1234"));
            user.setRole(User.Role.TEACHER);
            user.setEnabled(true);
        } else {
            user.setName(dto.getName());
            user.setRole(User.Role.TEACHER);
            user.setEnabled(true);
        }

        user = userRepository.save(user);

        Teacher teacher = teacherRepository.findByUserId(user.getId()).orElse(null);
        if (teacher == null) {
            teacher = new Teacher();
            teacher.setUser(user);
        }

        teacher.setSubject(dto.getSubject());
        teacher.setPhone(dto.getPhone());
        teacher.setQualification(dto.getQualification());

        return teacherRepository.save(teacher);
    }

    // ✅ GET ALL
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }
}
