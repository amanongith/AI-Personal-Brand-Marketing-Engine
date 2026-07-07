package com.personalbrand.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileUtil {

    public static boolean createDirectoryIfNotExists(String directoryPath) {
        try {
            Files.createDirectories(Paths.get(directoryPath));
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    public static boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }

    public static String readFileContent(String filePath) throws IOException {
        return new String(Files.readAllBytes(Paths.get(filePath)));
    }

    public static void writeFileContent(String filePath, String content) throws IOException {
        Path path = Paths.get(filePath);
        Files.createDirectories(path.getParent());
        Files.write(path, content.getBytes());
    }
}
